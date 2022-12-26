<template>
  <a-layout class="container py-4 gap-4">
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
            <a-menu-item key="profile">
              <template #icon>
                <user-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.profile }}
            </a-menu-item>
            <a-menu-item key="users" v-if="$rootAccess">
              <template #icon>
                <team-outlined />
              </template>
              {{ $locale.userProfilePage.mainMenu.users }}
            </a-menu-item>
            <a-menu-item key="rates" v-if="$rootAccess">
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
            <h3 v-if="$authorized" class="username d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2">{{ username }}<edit-outlined v-if="false" class="edit" @click="showEditUserModal" /></h3>
          </div>
          <a-modal
              v-if="false"
              :visible="editUserModalVisible"
              title="Edit"
              ok-text="Save"
              :confirm-loading="confirmEditLoading"
              @ok="onFinish"
              @cancel="onCancel"
              centered
          >
            <a-form
                class="edit-form"
                name="basic"
                autocomplete="off"
            >
              <a-form-item
                  label="Last name"
                  name="lastname"
                  :rules="[{ required: false }]"
              >
                <a-input v-model:value="lastName" />
              </a-form-item>

              <a-form-item
                  label="First name"
                  name="firstname"
                  :rules="[{ required: false }]"
              >
                <a-input v-model:value="firstName" />
              </a-form-item>

              <a-form-item
                  label="Patronymic"
                  name="patronymic"
                  :rules="[{ required: false }]"
              >
                <a-input v-model:value="patronymic" />
              </a-form-item>
            </a-form>
          </a-modal>
          <a-divider />
          <vc-profile-content :selected-key="selectedKey" />
        </vc-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {UsersService} from "@/api/services";
import {ApiRole} from "@/api/services/enums/ApiRole";
import {Message, User} from "@/api/services/types";
import {getFullUsername} from "@/api/utils/getFullUsername";
import VcProfileContent from "@/components/ProfileContentComponent/ProfileContentComponent.vue";
import {
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import {computed, defineComponent, reactive, ref, toRefs, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

interface FormState {
  lastName: string;
  firstName: string;
  patronymic: string;
}

interface MenuKey {
  key: string;
  rootAccess?: boolean;
}

interface MenuKeyState {
  profile: MenuKey;
  users: MenuKey;
  rates: MenuKey;
}

export default defineComponent({
  components: {
    VcProfileContent,
    UserOutlined,
    EditOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    ScheduleOutlined
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
    const menuKeys = ref<MenuKeyState>({
      profile: { key: 'profile' },
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
    const userInfoState = reactive<FormState>({
      lastName: '',
      firstName: '',
      patronymic: '',
    });

    const selectedKey = computed(() => state.selectedKeys[0]);

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
        userInfoState.lastName = user.lastName;
        userInfoState.firstName = user.firstName;
        userInfoState.patronymic = user.patronymic;
      } else {
        userInfoState.lastName = '';
        userInfoState.firstName = '';
        userInfoState.patronymic = '';
      }
    });

    // watch(() => selectedKey.value, (key, newKey) => {
    //   router.push({
    //     query: { key }
    //   });
    // });
    
    const showEditUserModal = () => {
      editUserModalVisible.value = true;
    }

    const toggleCollapsed = () => {
      state.collapsed = !state.collapsed;
      state.openKeys = state.collapsed ? [] : state.preOpenKeys;
    };

    const onFinish = async () => {
      confirmEditLoading.value = true;

      const response = await UsersService.EditUserData(userInfoState);

      if (response.status) {
        await store.dispatch("updateUserInfo");
      } else {
        console.log((response.data as Message).message);
      }

      confirmEditLoading.value = false;
      editUserModalVisible.value = false;
    };
    const onCancel = () => {
      userInfoState.lastName = store.getters.userInfo.lastName;
      userInfoState.firstName = store.getters.userInfo.firstName;
      userInfoState.patronymic = store.getters.userInfo.patronymic;
      editUserModalVisible.value = false;
    }

    return {
      ...toRefs(state),
      ...toRefs(userInfoState),
      selectedKey,
      editUserModalVisible,
      confirmEditLoading,
      showEditUserModal,
      onFinish,
      onCancel,
      toggleCollapsed,
    }
  }
});
</script>

<style lang="less" scoped>
.menu-wrapper {
  top: 60px;
}
.usertag {
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