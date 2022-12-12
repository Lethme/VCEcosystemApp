<template>
  <a-layout class="flex-grow-0 sticky-top t-0">
    <a-layout-content>
      <div class="container-fluid container-sm">
        <a-menu v-model:selectedKeys="current" :selectable="false" mode="horizontal" class="vc-navbar">
          <a-menu-item key="logo" class="logo-item">
            <div class="logo">
              <router-link to="/">
                <img src="/vc_logo.png" alt="" class="logo-img">
              </router-link>
            </div>
          </a-menu-item>
          <a-menu-item v-if="!$authorized" class="d-flex align-items-center" key="userProfile" style="margin-left: auto">
            <template #icon>
              <login-outlined />
            </template>
            <router-link to="/login">Log In</router-link>
          </a-menu-item>
          <a-sub-menu v-else key="userProfile1" style="margin-left: auto">
            <template #title>
              <user-outlined />
              {{ username }}
            </template>
            <a-menu-item key="setting:3" class="d-flex align-items-center">
              <template #icon>
                <file-outlined />
              </template>
              <router-link to="/orders/create">New Order</router-link>
            </a-menu-item>
            <a-menu-item key="setting:2" class="d-flex align-items-center">
              <template #icon>
                <solution-outlined />
              </template>
              <router-link to="/orders">Orders</router-link>
            </a-menu-item>
            <a-divider class="m-0" />
            <a-menu-item key="setting:1" class="d-flex align-items-center">
              <template #icon>
                <setting-outlined />
              </template>
              Settings
            </a-menu-item>
            <a-divider class="m-0" />
            <a-menu-item key="setting:0" class="log-out d-flex align-items-center" @click="$user.logout">
              <template #icon>
                <logout-outlined />
              </template>
              Log Out
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
    SettingOutlined,
    FileOutlined,
} from '@ant-design/icons-vue';

export default defineComponent({
  name: "VcNavbar",
  components: {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
    SettingOutlined,
    FileOutlined,
  },
  setup() {
    const current = ref<string[]>([]);
    return {
      current,
    };
  },
  computed: {
    username() {
      const fullName = [this.$user?.lastName, this.$user?.firstName, this.$user?.patronymic].map(str => str?.trim()).join(" ");

      if (this.$windowWidth <= 576 && this.$user) {
        return `${this.$user?.lastName[0].toLocaleUpperCase() + this.$user?.lastName.substring(1)} ${this.$user?.firstName[0].toLocaleUpperCase()}. ${this.$user?.patronymic[0].toLocaleUpperCase()}.`
      }

      return fullName;
    }
  }
});
</script>

<style lang="less">
@import 'NavbarComponent';
</style>