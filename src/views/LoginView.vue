<template>
  <a-layout>
    <div class="container d-flex flex-column justify-content-center align-items-center">
      <div class="form-wrapper d-flex flex-column col-12 col-lg-8">
        <a-form
            class="login-form"
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
          <a-form-item
              class="d-flex justify-content-center"
          >
            <div class="logo-wrapper py-4 col-12 d-flex justify-content-center">
              <img class="logo-img col-12 col-sm-5" src="/vc_logo.png" alt="">
            </div>
          </a-form-item>

          <a-form-item
              label="Логин"
              name="username"
              class="d-flex flex-wrap"
              :label-col="{ span: 24 }"
              :rules="[{ required: true, message: 'Введите Ваш логин' }]"
          >
            <a-input v-model:value="formState.username" />
          </a-form-item>

          <a-form-item
              label="Пароль"
              name="password"
              class="d-flex flex-wrap"
              :label-col="{ span: 24 }"
              :rules="[{ required: true, message: 'Введите Ваш пароль' }]"
          >
            <a-input-password v-model:value="formState.password" />
          </a-form-item>

          <a-form-item name="remember">
            <a-checkbox v-model:checked="formState.remember">Запомнить меня</a-checkbox>
          </a-form-item>

          <a-form-item>
            <a-button
                size="large"
                type="primary"
                html-type="submit"
                class="submit-btn col-12 col-sm-auto px-4"
            >
              Войти
            </a-button>
          </a-form-item>

          <a-alert
              v-if="formState.exception"
              :message="formState.exception"
              type="error"
              closable
          />
        </a-form>
      </div>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {Rule} from "ant-design-vue/lib/form";
import {defineComponent, PropType, reactive} from "vue";
import {ApiService, AuthService} from "@/api/services";
import {Message} from "@/api/services/types/Message";
import {Loader} from "@/utils";
import {useRoute, useRouter} from "vue-router";

interface FormState {
  username: string;
  password: string;
  remember: boolean;
  exception?: string;
}

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const validatePassword = async (_rule: Rule, value: string) => {
      if (!ApiService.PasswordMatch(value)) {
        return Promise.reject("Weak password");
      }

      return Promise.resolve();
    };

    const formState = reactive<FormState>({
      username: '',
      password: '',
      remember: true,
      exception: (router.options.history.state.exception as string) || undefined,
    });
    return {
      formState,
      validatePassword,
    };
  },
  methods: {
    onFinish(formData: any) {
      this.formState.exception = undefined;
      Loader.Use(async () => {
        const response = await AuthService.Authorize(formData);

        if (response.status) {
          // ToDo
          await this.$store.dispatch("updateUserInfo");
          this.$router.push(this.$route.query.redirect as string || "/orders");
        } else {
          this.formState.exception = 'Неверно указан логин или пароль';
        }
      })
    },
    onFinishFailed(errorInfo: any) {
      //console.log('Failed:', errorInfo);
    },
  }
});
</script>

<style lang="less" scoped>
  @import "@/var.less";

  .container {
    //height: 100vh;
    flex-grow: 1;

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
  }
</style>
