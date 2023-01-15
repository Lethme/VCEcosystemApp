<template>
  <a-layout class="layout flex-grow-1 py-sm-4 orders">
    <div class="container d-flex flex-column flex-grow-1 py-sm-4">
      <a-layout-content class="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
        <div class="form-wrapper d-flex flex-column col-12 col-lg-8">
          <a-form
              class="login-form"
              :model="formState"
              name="basic"
              autocomplete="off"
              @submit="(event) => event.preventDefault()"
              @finish="onFinish"
          >
            <a-form-item class="d-flex justify-content-center">
              <div class="logo-wrapper py-4 col-12 d-flex justify-content-center">
                <img class="logo-img col-12 col-sm-5" src="/vc_logo.png" alt="">
              </div>
            </a-form-item>

            <a-form-item class="d-flex justify-content-center">
              <h3 v-if="user">{{ !confirmed ? `${username}, добро пожаловать в ВЦ!` :  'Ваш аккаунт успешно подтверждён'}}</h3>
              <h5>{{ !confirmed ? 'Задайте Ваш пароль для входа в систему' : 'Теперь Вы можете авторизоваться' }}</h5>
            </a-form-item>

            <a-form-item v-if="!confirmed" has-feedback label="Пароль" name="password" class="d-flex flex-wrap" :label-col="{ span: 24 }" autocomplete="off" :rules="[{ required: true, validator: validatePassword }]">
              <a-input-password v-model:value="formState.password" type="password" autocomplete="off">
                <template #prefix>
                  <a-popover>
                    <template #content>
                      <h6
                          v-memo="passwordState.map(s => s.state)"
                          v-text="formState.password ? (passwordState.every(s => s.state) ? 'Надёжный пароль' : 'Слабый пароль') : 'Введите пароль'"
                          :style="{color: passwordState.every(s => s.state) ? '#52C41A' : '#FF4D4F'}"
                      />
                      <a-divider />
                      <h6 class="d-flex align-items-start align-items-sm-center text-start"
                          v-memo="passwordState.map(s => s.state)"
                          v-for="warning in passwordState"
                          :key="warning.type"
                      >
                        <check-circle-filled v-if="warning.state" :style="{color: '#52C41A'}" />
                        <close-circle-filled v-else :style="{color: '#FF4D4F'}" />
                        &nbsp;{{ warning.text }}
                      </h6>
                    </template>
                    <info-circle-outlined type="user" />
                  </a-popover>
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item v-if="!confirmed" has-feedback label="Повторите пароль" name="passwordConfirm" class="d-flex flex-wrap" :label-col="{ span: 24 }" autocomplete="off" :rules="[{ required: true, validator: validateConfirmPassword }]">
              <a-input-password
                  v-model:value="formState.passwordConfirm"
                  type="password" autocomplete="off"
              />
            </a-form-item>

            <a-alert
                v-if="formState.exception && !confirmed"
                :message="formState.exception"
                type="error"
                closable
            />

            <a-form-item>
              <a-button
                  v-if="!confirmed"
                  :disabled="!passwordConfirmValidated || !passwordValidated"
                  size="large"
                  type="primary"
                  html-type="submit"
                  class="submit-btn col-12 col-sm-auto px-4 mt-3"
              >
                Активировать аккаунт
              </a-button>
              <a-button
                  v-else
                  size="large"
                  type="primary"
                  class="col-12 col-sm-auto px-4 mt-3"
              >
                <router-link to="/login">
                  Войти
                </router-link>
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-layout-content>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref} from "vue";
import {Loader} from "@/utils";
import {Message, PasswordState, User} from "@/api/services/types";
import {ApiService, UsersService} from "@/api/services";
import { Rule } from "ant-design-vue/lib/form";
import {getFullUsername} from "@/api/utils/getFullUsername";
import {useRoute, useRouter} from "vue-router";
import { InfoCircleOutlined, CloseCircleFilled, CheckCircleFilled } from "@ant-design/icons-vue";

interface FormState {
  password: string;
  passwordConfirm: string;
  exception?: string;
}

export default defineComponent({
  components: {
    InfoCircleOutlined,
    CloseCircleFilled,
    CheckCircleFilled,
  },
  computed: {
    username(): string | undefined {
      if (this.user) {
        return `${this.user?.firstName[0].toLocaleUpperCase() + this.user?.firstName.substring(1)} ${this.user?.patronymic[0].toLocaleUpperCase() + this.user?.patronymic.substring(1)}`;
      }

      return undefined;
    },
    passwordState(): PasswordState {
      const state = ApiService.PasswordState(this.formState.password);
      return state;
    }
  },
  methods: {
    async loadUserInfo() {
      const response = await UsersService.GetUserByUUID(this.uuid);

      if (response.status) {
        this.user = response.data as User;
      } else {
        this.$router.push('/');
      }
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const uuid = computed<string>(() => route.params.uuid as string);

    const confirmed = ref<boolean>(false);

    const passwordValidated = ref<boolean>(false);
    const passwordConfirmValidated = ref<boolean>(false);

    const uuidMatch = (route.params.uuid as string).match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

    if (!uuidMatch || !uuidMatch.length) {
      router.push("/");
    }

    const user = ref<User | undefined>();
    const formState = reactive<FormState>({
      password: '',
      passwordConfirm: '',
      exception: undefined,
    });

    const validatePassword = async (_rule: Rule, value: string) => {
      if (!value) {
        return Promise.reject("Введите пароль");
      }

      if (!ApiService.PasswordMatch(value)) {
        passwordValidated.value = false;
        return Promise.reject("Слабый пароль");
      }

      passwordValidated.value = true;
      return Promise.resolve();
    };

    const validateConfirmPassword = async (_rule: Rule, value: string) => {
      if (value !== formState.password) {
        passwordConfirmValidated.value = false;
        return Promise.reject("Пароли не совпадают")
      }

      passwordConfirmValidated.value = true;
      return Promise.resolve();
    };

    const onFinish = async (formState: FormState) => {
      await Loader.Use(async () => {
        const response = await UsersService.ConfirmUserByUUID(uuid.value, formState.password);

        if (response.status) {
          confirmed.value = true;
        } else {
          formState.exception = (response.data as Message).message;
        }
      });
    };

    return {
      uuid,
      user,
      confirmed,
      formState,
      onFinish,
      validatePassword,
      validateConfirmPassword,
      passwordValidated,
      passwordConfirmValidated,
    }
  },
  mounted() {
    Loader.Use(async () => {
      await this.loadUserInfo();
    });
  }
})
</script>

<style lang="less">
@import "@/var.less";

.greetings {
  color: @mainColor;
}

.form-wrapper {
  box-shadow: 0px 4px 14px 0px rgba(34, 60, 80, 0.2);
  //border: 1px solid rgba(34, 60, 80, 0.2);
  border-radius: 2em;
  padding: 2em 5em;
  background: #fff;

  @media (max-width: 576px) {
    padding: 1em 3em;
  }

  .login-form {
    width: 100%;

    .logo-img {
      max-width: 300px;
    }

    .error {
      color: red;
      font-size: 1.3em;
    }
  }
}
</style>