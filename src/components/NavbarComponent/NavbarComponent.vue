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
              <vc-layout class="flex-grow-0" :style="{width: '30px', height: '30px', padding: 0, borderRadius: '50%', overflow: 'hidden', boxShadow: 'none'}">
                <div class="profile-picture-img" :style="{ background: hasProfilePicture ? 'url(' + $user.getProfilePictureUrl() + ') center center/cover no-repeat' : 'url('+ $pictureFallback +') center center/cover no-repeat', boxShadow: hasProfilePicture ? '' : 'none' }"></div>
              </vc-layout>
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
import {UsersService} from "@/api/services";
import {User} from "@/api/services/types";
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
import {useStore} from "vuex";

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
    const store = useStore();
    const current = ref<string[]>([]);
    const hasProfilePicture = ref<boolean>(false);
    const checkProfilePicture = async () => {
      const user: User = store.getters.userInfo;

      if (user) {
        hasProfilePicture.value = await UsersService.HasProfilePicture(user.uuid);
      }
    }

    onMounted(() => checkProfilePicture());
    watch(() => store.getters.userInfo, () => {
      checkProfilePicture();
    });

    return {
      current,
      hasProfilePicture,
      checkProfilePicture,
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