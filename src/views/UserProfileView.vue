<template>
  <a-layout class="container-fluid py-4 gap-4">
    <a-layout-sider class="p-0" :width="collapsed ? 'auto' : $mobile ? 168 : 256" :collapsible="$mobile" v-model:collapsed="collapsed">
      <vc-layout class="px-0 py-2 h-100 position-relative">
        <div class="menu-wrapper position-sticky">
          <div v-if="$mobile" class="container-fluid px-2">
            <a-button type="primary" block @click="toggleCollapsed" style="margin-bottom: 16px">
              <MenuUnfoldOutlined v-if="collapsed" />
              <MenuFoldOutlined v-else />
            </a-button>
          </div>
          <a-menu
              class="w-100"
              mode="inline"
              v-model:openKeys="openKeys"
              v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item :key="menuKeys.profile.key">
              <template #icon>
                <user-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.profile }}
            </a-menu-item>
            <a-menu-item :key="menuKeys.preferences.key" v-if="$operatorAccess">
              <template #icon>
                <coffee-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.preferences }}
            </a-menu-item>
            <a-menu-item :key="menuKeys.users.key" v-if="$rootAccess">
              <template #icon>
                <team-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.users }}
            </a-menu-item>
            <a-menu-item :key="menuKeys.services.key">
              <template #icon>
                <unordered-list-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.services }}
            </a-menu-item>
            <a-menu-item :key="menuKeys.rates.key" v-if="$rootAccess">
              <template #icon>
                <schedule-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.rates }}
            </a-menu-item>
          </a-menu>
        </div>
      </vc-layout>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <vc-layout class="h-100">
          <div class="profile-header d-flex flex-column align-items-center gap-3">
            <vc-profile-picture width="150" height="150" :uploadable="true" />
            <h5 v-if="$authorized" class="usertag d-flex align-items-center gap-2">@{{ $user.username }}</h5>
            <h6 v-if="$authorized" class="userroles d-flex align-items-center mb-1 gap-2">{{ $user.roles.map(role => $locale.roles[role.value]).join(', ') }}</h6>
            <h3 v-if="$authorized" class="username d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2">{{ username }}<sync-outlined class="refresh-btn" @click="refreshUserInfo(true)" /></h3>
          </div>
          <a-divider />
          <vc-profile-content :selected-key="selectedKey" :menu-keys="menuKeys" />
        </vc-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {ApiRole} from "@/api/services/enums/ApiRole";
import {User} from "@/api/services/types";
import {getFullUsername} from "@/api/utils/getFullUsername";
import VcProfileContent from "@/components/ProfileContentComponent/ProfileContentComponent.vue";
import {Loader} from "@/utils";
import {
    SyncOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
    TeamOutlined,
    UserOutlined,
    UnorderedListOutlined,
    CoffeeOutlined,
} from '@ant-design/icons-vue';
import {computed, defineComponent, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

interface FormState {
  lastName: string;
  firstName: string;
  patronymic: string;
}

export interface MenuKey {
  key: string;
  rootAccess?: boolean;
  moderAccess?: boolean;
  operatorAccess?: boolean;
}

export interface MenuKeyState {
  profile: MenuKey;
  preferences: MenuKey;
  users: MenuKey;
  rates: MenuKey;
  services: MenuKey;
}

export default defineComponent({
  components: {
    VcProfileContent,
    UserOutlined,
    SyncOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    ScheduleOutlined,
    UnorderedListOutlined,
    CoffeeOutlined,
  },
  computed: {
    username() {
      return getFullUsername(this.$user);
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const user = computed(() => store.getters.userInfo as User);
    const rootAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Root) : false);
    const moderAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Moderator) : false);
    const operatorAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Operator) : false);
    const menuKeys = ref<MenuKeyState>({
      profile: { key: 'profile' },
      preferences: { key: "preferences", operatorAccess: true },
      services: { key: 'services' },
      users: { key: 'users', rootAccess: true },
      rates: { key: 'rates', rootAccess: true },
    });
    const editUserModalVisible = ref<boolean>(false);
    const confirmEditLoading = ref<boolean>(false);
    const state = reactive({
      collapsed: store.getters.mobile,
      selectedKeys: [ menuKeys.value.profile.key ],
      openKeys: ['sub1'],
      preOpenKeys: ['sub1'],
    });

    const selectedKey = computed(() => state.selectedKeys[0] || menuKeys.value.profile.key);

    watch(
        () => state.openKeys,
        (val, oldVal) => {
          state.preOpenKeys = oldVal;
        },
    );

    watch(() => store.getters.mobile, (val, oldVal) => {
      state.collapsed = val;
    });

    watch(() => store.getters.userInfo, (user: User) => {
      if (user) {
        const key = route.query.key as string || menuKeys.value.profile.key;
        const menuKey = (menuKeys.value as any)[key] as MenuKey;

        if (
            (menuKey.rootAccess && rootAccess.value) ||
            (menuKey.moderAccess && moderAccess.value) ||
            (menuKey.operatorAccess && operatorAccess.value) ||
            (!menuKey.rootAccess && !menuKey.moderAccess && !menuKey.operatorAccess)
        ) {
          state.selectedKeys = [menuKey.key];
        } else {
          state.selectedKeys = [menuKeys.value.profile.key];
          router.push({
            query: { key: undefined }
          });
        }
      }
    });

    watch(() => selectedKey.value, (key, oldKey) => {
      state.selectedKeys = [key];
      router.push({
        query: { key: key !== menuKeys.value.profile.key ? key : undefined }
      });
    });
    
    const showEditUserModal = () => {
      editUserModalVisible.value = true;
    }

    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    onMounted(async () => {
      await Loader.Use(async () => await store.dispatch("updateUserInfo"));
    })

    return {
      ...toRefs(state),
      menuKeys,
      selectedKey,
      editUserModalVisible,
      confirmEditLoading,
      showEditUserModal,
      toggleCollapsed,
    }
  }
});
</script>

<style lang="less" scoped>
.menu-wrapper {
  top: 60px;
}
.usertag,
.userroles {
  color: #a0a0a0;
}
.edit {
  cursor: pointer;
  transition: all .2s ease;

  &:hover,
  &:active {
    color: rgb(24, 144, 255);
  }
}
</style>