<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" class="vc-navbar">
    <a-menu-item key="logo" class="logo-item">
      <div class="logo">
        <router-link to="/">
          <img src="/vc_logo.png" alt="" class="logo-img">
        </router-link>
      </div>
    </a-menu-item>
    <a-menu-item key="mail">
      <template #icon>
        <mail-outlined />
      </template>
      Navigation One
    </a-menu-item>
    <a-menu-item key="app" disabled>
      <template #icon>
        <appstore-outlined />
      </template>
      Navigation Two
    </a-menu-item>
    <a-sub-menu key="sub1">
      <template #icon>
        <setting-outlined />
      </template>
      <template #title>Navigation Three - Submenu</template>
      <a-menu-item-group title="Item 1">
        <a-menu-item key="setting:1">Option 1</a-menu-item>
        <a-menu-item key="setting:2">Option 2</a-menu-item>
      </a-menu-item-group>
      <a-menu-item-group title="Item 2">
        <a-menu-item key="setting:3">Option 3</a-menu-item>
        <a-menu-item key="setting:4">Option 4</a-menu-item>
      </a-menu-item-group>
    </a-sub-menu>
    <a-menu-item key="alipay">
      <a href="https://antdv.com" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    </a-menu-item>
    <a-menu-item v-if="!$authorized" key="userProfile" style="margin-left: auto">
      <router-link to="/login">Log In</router-link>
    </a-menu-item>
    <a-sub-menu v-else key="userProfile1" style="margin-left: auto">
      <template #title>{{ username }}</template>
      <a-menu-item key="setting:1" class="log-out" @click="$user.logout">
        <a-divider class="m-0" />
        Log Out
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: "VcNavbar",
  components: {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
  },
  setup() {
    const current = ref<string[]>(['mail']);
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