<template>
  <a-layout class="container py-4 gap-4">
    <a-layout-sider class="p-0" :width="collapsed ? 'auto' : $windowWidth <= 768 ? 156 : 256" :collapsible="$windowWidth <= 768" v-model:collapsed="collapsed">
      <vc-layout class="px-0 py-2 h-100">
        <div v-if="$windowWidth <= 768" class="container-fluid px-2">
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
          <a-menu-item key="1">
            <template #icon>
              <user-outlined />
            </template>
            Profile
          </a-menu-item>
<!--          <a-sub-menu key="sub1">-->
<!--            <template #icon>-->
<!--              <AppstoreOutlined />-->
<!--            </template>-->
<!--            <template #title>Navigation Three</template>-->
<!--            <a-menu-item key="3">Option 3</a-menu-item>-->
<!--            <a-menu-item key="4">Option 4</a-menu-item>-->
<!--            <a-sub-menu key="sub1-2" title="Submenu">-->
<!--              <a-menu-item key="5">Option 5</a-menu-item>-->
<!--              <a-menu-item key="6">Option 6</a-menu-item>-->
<!--            </a-sub-menu>-->
<!--          </a-sub-menu>-->
<!--          <a-sub-menu key="sub2">-->
<!--            <template #icon>-->
<!--              <SettingOutlined />-->
<!--            </template>-->

<!--            <template #title>Navigation Four</template>-->
<!--            <a-menu-item key="7">Option 7</a-menu-item>-->
<!--            <a-menu-item key="8">Option 8</a-menu-item>-->
<!--            <a-menu-item key="9">Option 9</a-menu-item>-->
<!--            <a-menu-item key="10">Option 10</a-menu-item>-->
<!--          </a-sub-menu>-->
        </a-menu>
      </vc-layout>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <vc-layout class="h-100">
          <div class="profile-header d-flex flex-column align-items-center gap-3">
            <vc-profile-picture width="150" height="150" :uploadable="true" />
            <h5 v-if="$authorized" class="usertag d-flex align-items-center gap-2">@{{ $user.username }}</h5>
            <h3 v-if="$authorized" class="username d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2">{{ username }} <edit-outlined class="edit" @click="showEditUserModal" /></h3>
          </div>
          <a-modal
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
        </vc-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs, watch} from "vue";
import {
    UserOutlined,
    EditOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons-vue';
import {getFullUsername} from "@/api/utils/getFullUsername";
import {useStore} from "vuex";
import {Message, User} from "@/api/services/types";
import {UsersService} from "@/api/services";

interface FormState {
  lastName: string;
  firstName: string;
  patronymic: string;
}

export default defineComponent({
  components: {
    UserOutlined,
    EditOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  },
  computed: {
    username() {
      return getFullUsername(this.$user);
    },
  },
  setup() {
    const store = useStore();
    const editUserModalVisible = ref(false);
    const confirmEditLoading = ref<boolean>(false);
    const state = reactive({
      collapsed: true,
      selectedKeys: ['1'],
      openKeys: ['sub1'],
      preOpenKeys: ['sub1'],
    });
    const userInfoState = reactive<FormState>({
      lastName: '',
      firstName: '',
      patronymic: '',
    });

    watch(
        () => state.openKeys,
        (val, oldVal) => {
          state.preOpenKeys = oldVal;
        },
    );

    watch(() => store.getters.windowWidth, (val, oldVal) => {
      if (val > 768 && state.collapsed) {
        state.collapsed = false;
      }

      if (val <= 768 && !state.collapsed) {
        state.collapsed = true;
      }
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
    })
    
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