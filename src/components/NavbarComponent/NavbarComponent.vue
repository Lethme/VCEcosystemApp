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
<!--              <user-outlined />-->
              <vc-profile-picture :shadow="false" width="30" height="30" />
              {{ username }}
            </template>
            <a-menu-item v-if="tempOrdersExist" key="setting:4" class="d-flex align-items-center">
              <template #icon>
                <bars-outlined />
              </template>
              <router-link to="/orders/create">Edit New Orders</router-link>
            </a-menu-item>
            <a-menu-item v-else key="setting:3" class="d-flex align-items-center">
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
                <user-outlined />
              </template>
              <router-link to="/profile">Account</router-link>
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
import {defineComponent, onMounted, ref, watch} from 'vue';
import {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
    FileOutlined,
    BarsOutlined,
} from '@ant-design/icons-vue';
import {getFullUsername} from "@/api/utils/getFullUsername";

export default defineComponent({
  name: "VcNavbar",
  components: {
    LoginOutlined,
    LogoutOutlined,
    SolutionOutlined,
    UserOutlined,
    FileOutlined,
    BarsOutlined,
  },
  setup() {
    const current = ref<string[]>([]);

    return {
      current,
    };
  },
  computed: {
    username() {
      return getFullUsername(this.$user, {
        short: this.$windowWidth <= 576,
      })
    },
    tempOrdersExist() {
      return this.$store.getters.panes.length > 1
          || (this.$store.getters.panes.length === 1 && this.$store.getters.panes[0].order.dataSource.length);
    }
  }
});
</script>

<style lang="less">
@import 'NavbarComponent';
</style>