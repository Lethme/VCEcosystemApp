<template>
  <a-layout class="flex-grow-0 sticky-top t-0">
    <a-layout-content>
      <div class="container">
        <a-menu v-model:selectedKeys="current" mode="horizontal" class="vc-navbar">
          <a-menu-item key="logo" class="logo-item">
            <div class="logo">
              <router-link to="/">
                <img src="/vc_logo.png" alt="" class="logo-img">
              </router-link>
            </div>
          </a-menu-item>
<!--          <a-menu-item key="mail">-->
<!--            <template #icon>-->
<!--              <mail-outlined />-->
<!--            </template>-->
<!--            Navigation One-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="app" disabled>-->
<!--            <template #icon>-->
<!--              <appstore-outlined />-->
<!--            </template>-->
<!--            Navigation Two-->
<!--          </a-menu-item>-->
<!--          <a-sub-menu key="sub1">-->
<!--            <template #icon>-->
<!--              <setting-outlined />-->
<!--            </template>-->
<!--            <template #title>Navigation Three - Submenu</template>-->
<!--            <a-menu-item-group title="Item 1">-->
<!--              <a-menu-item key="setting:1">Option 1</a-menu-item>-->
<!--              <a-menu-item key="setting:2">Option 2</a-menu-item>-->
<!--            </a-menu-item-group>-->
<!--            <a-menu-item-group title="Item 2">-->
<!--              <a-menu-item key="setting:3">Option 3</a-menu-item>-->
<!--              <a-menu-item key="setting:4">Option 4</a-menu-item>-->
<!--            </a-menu-item-group>-->
<!--          </a-sub-menu>-->
<!--          <a-menu-item key="alipay">-->
<!--            <a href="https://antdv.com" target="_blank" rel="noopener noreferrer">-->
<!--              Navigation Four - Link-->
<!--            </a>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item v-if="$authorized" key="createOrder">-->
<!--            <router-link to="/">Create Order</router-link>-->
<!--          </a-menu-item>-->
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
            <a-menu-item key="setting:1" class="d-flex align-items-center">
              <template #icon>
                <solution-outlined />
              </template>
              <router-link to="/orders">Orders</router-link>
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
import { LoginOutlined, LogoutOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: "VcNavbar",
  components: {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
  },
  setup() {
    const current = ref<string[]>([]);
    return {
      current,
    };
  },
  computed: {
    username() {
      return [this.$user?.lastName, this.$user?.firstName, this.$user?.patronymic].map(str => str?.trim()).join(" ");
    }
  }
});
</script>

<style lang="less">
@import 'NavbarComponent';
</style>