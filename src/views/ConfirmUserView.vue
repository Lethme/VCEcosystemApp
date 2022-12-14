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
              @finish="onFinish"
              @finishFailed="onFinishFailed"
          >
            <a-form-item class="d-flex justify-content-center">
              <div class="logo-wrapper py-4 col-12 d-flex justify-content-center">
                <img class="logo-img col-12 col-sm-5" src="/vc_logo.png" alt="">
              </div>
            </a-form-item>

            <a-form-item class="d-flex justify-content-center">
              <h3 class="greetings">{{ `Welcome to VC, ${username}!` }}</h3>
              <h5 class="greetings">Set your new password to complete registration</h5>
            </a-form-item>

            <a-form-item has-feedback label="Password" name="password" :rules="[{ required: true }]">
              <a-input v-model:value="formState.password" type="password" autocomplete="off" />
            </a-form-item>
            <a-form-item has-feedback label="Confirm" name="passwordConfirm" :rules="[{ required: true, validator: validateConfirmPassword }]">
              <a-input v-model:value="formState.passwordConfirm" type="password" autocomplete="off" />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" class="submit-btn col-12 col-sm-auto px-4 mt-3">Confirm Account</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-layout-content>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {Loader} from "@/utils";
import {Message, User} from "@/api/services/types";
import {UsersService} from "@/api/services";
import { Rule } from "ant-design-vue/lib/form";
import {getFullUsername} from "@/api/utils/getFullUsername";

interface FormState {
  password: string;
  passwordConfirm: string;
}

export default defineComponent({
  computed: {
    uuid(): string {
      return this.$route.params.uuid as string;
    },
    username(): string | undefined {
      if (this.user) {
        return `${this.user?.firstName[0].toLocaleUpperCase() + this.user?.firstName.substring(1)} ${this.user?.patronymic[0].toLocaleUpperCase() + this.user?.patronymic.substring(1)}`;
      }

      return undefined;
    }
  },
  methods: {
    async loadUserInfo() {
      const response = await UsersService.GetUserByUUID(this.uuid);

      if (response.status) {
        this.user = response.data as User;
      } else {
        console.log((response.data as Message).message);
      }
    },
  },
  setup() {
    const user = ref<User | undefined>();
    const formState = reactive<FormState>({
      password: '',
      passwordConfirm: '',
    });

    const validateConfirmPassword = async (_rule: Rule, value: string) => {
      if (value === '') {
        return Promise.reject();
      } else if (value !== formState.password) {
        return Promise.reject("Passwords don't match")
      } else {
        return Promise.resolve();
      }
    };

    const onFinish = (formData: FormData) => {
      console.log(formData);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    return {
      user,
      formState,
      onFinish,
      onFinishFailed,
      validateConfirmPassword,
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