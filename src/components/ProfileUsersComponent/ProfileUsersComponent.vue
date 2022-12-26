<template>
  <div class="header-wrapper d-flex pb-3 flex-column flex-md-row gap-3 justify-content-between align-items-center">
    <div class="headers">
      <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.users }}
        <sync-outlined class="refresh-btn" @click="updateUsersList" />
      </h6>
      <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.users }}
        <sync-outlined class="refresh-btn" @click="updateUsersList" />
      </h4>
    </div>
    <div class="btn-wrapper">
      <a-button type="primary" size="large">{{ $locale.userProfilePage.addUserButtonTitle }}</a-button>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="users" :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }">
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button v-if="!record.active" type="primary" @click="() => showConfirmLinkModal(record)">{{ $locale.userProfilePage.usersTableButtonsTitles.confirmLink }}</a-button>
          <a-popconfirm
              v-else
              :title="$locale.userProfilePage.usersTableButtonsTitles.deactivate + '?'"
              @confirm="() => disableUserAccount(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.userProfilePage.usersTableButtonsTitles.deactivate }}</a-button>
          </a-popconfirm>
        </div>
      </template>
      <template #active="{ record }">
        <check-circle-filled v-if="record.active" :style="{color: '#52C41A'}" />
        <close-circle-filled v-else :style="{color: '#FF4D4F'}" />
      </template>
    </a-table>
    <a-table v-else bordered :data-source="users" :columns="columns">
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button v-if="!record.active" type="primary" @click="() => showConfirmLinkModal(record)">{{ $locale.userProfilePage.usersTableButtonsTitles.confirmLink }}</a-button>
          <a-popconfirm
              v-else
              :title="$locale.userProfilePage.usersTableButtonsTitles.deactivate + '?'"
              @confirm="() => disableUserAccount(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.userProfilePage.usersTableButtonsTitles.deactivate }}</a-button>
          </a-popconfirm>
        </div>
      </template>
      <template #active="{ record }">
        <check-circle-filled v-if="record.active" :style="{color: '#52C41A'}" />
        <close-circle-filled v-else :style="{color: '#FF4D4F'}" />
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {UsersService} from "@/api/services";
import {User} from "@/api/services/types";
import {getFullUsername} from "@/api/utils/getFullUsername";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {Modal} from "ant-design-vue";
import {computed, createVNode, defineComponent, onMounted, ref} from "vue";
import {useStore} from "vuex";

import {
  SyncOutlined,
  CheckCircleFilled,
  CloseCircleFilled, QuestionCircleOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
  name: "VcProfileUsers",
  components: {
    SyncOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
  },
  setup() {
    const store = useStore();
    const locale = computed(() => store.getters.localeRecord as LocaleRecord);
    const users = ref<Array<User>>([]);
    const updateUsersList = async () => {
      await Loader.Use(async () => {
        const response = await UsersService.GetUsersPrivate();
        if (response.status) {
          users.value = response.data as Array<User>;
        } else {
          users.value = [];
        }
      });
    }

    const columns = computed(() => {
      return [
        {
          title: locale.value.userProfilePage.usersTableHeaders.id,
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: locale.value.userProfilePage.usersTableHeaders.lastName,
          dataIndex: 'lastName',
          key: 'lastName',
        },
        {
          title: locale.value.userProfilePage.usersTableHeaders.firstName,
          dataIndex: 'firstName',
          key: 'firstName',
        },
        {
          title: locale.value.userProfilePage.usersTableHeaders.patronymic,
          dataIndex: 'patronymic',
          key: 'patronymic',
        },
        {
          title: locale.value.userProfilePage.usersTableHeaders.username,
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: locale.value.userProfilePage.usersTableHeaders.active,
          dataIndex: 'active',
          key: 'active',
          slots: { customRender: 'active' },
        },
        {
          title: locale.value.newOrdersPage.orderServicesTableHeaders.actions,
          dataIndex: 'operation',
          key: 'operation',
          align: "right",
          slots: { customRender: 'operation' },
        },
      ]
    })

    onMounted(async () => {
      await updateUsersList();
    });

    const showConfirmLinkModal = (record: User) => {
      Modal.info({
        title: () => getFullUsername(record, {
          short: store.getters.windowWidth <= 576,
        }),
        width: "auto",
        content: () => `${window.location.origin}/confirm/${record.uuid}`,
        centered: true,
        okType: "primary",
      });
    }

    const disableUserAccount = async (id: number) => {
      await Loader.Use(async () => {
        const response = await UsersService.DisableUserAccountPrivate(id);

        if (response.status) {
          await updateUsersList();
        }
      });
    }

    return {
      users,
      columns,
      updateUsersList,
      showConfirmLinkModal,
      disableUserAccount,
    }
  },
})
</script>

<style lang="less">
@import "ProfileUsersComponent";
</style>