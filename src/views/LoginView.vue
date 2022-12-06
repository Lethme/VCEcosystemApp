<template>
  <div class="container d-flex flex-column justify-content-center align-items-center">
    <div class="form-wrapper d-flex flex-column col-12 col-md-8 col-lg-6">
      <a-form
          class="login-form"
          :model="formState"
          name="basic"
          :label-col="{ span: 4 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            class="d-flex justify-content-center"
        >
          <div class="logo-wrapper py-4 col-12 d-flex justify-content-center">
            <img class="logo-img col-4" src="/vc_logo.png" alt="">
          </div>
        </a-form-item>

        <a-form-item
            label="Username"
            name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]"
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

        <a-form-item v-if="formState.exception">
          <p class="error" v-html="formState.exception"></p>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue";
import {AuthService} from "@/api/services";
import {Message} from "@/api/services/types/Message";
import {Loader} from "@/utils";

interface FormState {
  username: string;
  password: string;
  remember: boolean;
  exception?: string;
}

export default defineComponent({
  name: "LoginView",
  setup() {
    const formState = reactive<FormState>({
      username: '',
      password: '',
      remember: true,
      exception: undefined,
    });
    const onFinish = (formData: any) => {
      formState.exception = undefined;
      Loader.Use(async () => {
        const response = await AuthService.Authorize(formData);

        if (response.status) {
          // ToDo
        } else {
          formState.exception = (response.data as Message).message;
        }
      })
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style lang="less" scoped>
  .container {
    height: 100vh;

    .login-form {
      width: 100%;
    }
  }
</style>
