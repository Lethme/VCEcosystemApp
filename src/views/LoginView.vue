<template>
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
            label="Username"
            name="username"
            :rules="[{ required: true, message: 'Please input your username' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="submit-btn col-12 col-sm-auto px-4">Login</a-button>
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
</template>

<script lang="ts">
import {defineComponent, PropType, reactive} from "vue";
import {AuthService} from "@/api/services";
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
  name: "LoginView",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const formState = reactive<FormState>({
      username: '',
      password: '',
      remember: true,
      exception: (router.options.history.state.exception as string) || undefined,
    });
    return {
      formState,
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
          this.$router.push(this.$route.query.redirect as string || "/");
        } else {
          this.formState.exception = (response.data as Message).message;
        }
      })
    },
    onFinishFailed(errorInfo: any) {
      console.log('Failed:', errorInfo);
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
