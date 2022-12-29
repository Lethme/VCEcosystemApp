<template>
  <div class="header-wrapper d-flex pb-3 flex-column flex-xl-row gap-3 justify-content-between align-items-center">
    <div class="headers d-flex gap-3 align-items-center col-12 col-xl-auto">
      <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.services }}
        <sync-outlined class="refresh-btn" @click="updateServicesList" />
      </h6>
      <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.services }}
        <sync-outlined class="refresh-btn" @click="updateServicesList" />
      </h4>
      <a-switch v-if="$rootAccess" :checked-children="$locale.userProfilePage.removedServicesSwitch.checked" :un-checked-children="$locale.userProfilePage.removedServicesSwitch.unchecked" v-model:checked="showRemovedServices" @change="refreshServices" />
    </div>
    <div class="actions-wrapper d-flex flex-column flex-xl-row gap-3 gap-xl-2 col-12 col-xl-6">
      <div class="input-field w-100">
        <a-input v-model:value="searchText" size="large">
          <template #prefix>
            <search-outlined />
          </template>
          <template #suffix>
            <a-tooltip :title="$locale.homePage.priceListSearchTooltip">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </template>
        </a-input>
      </div>
      <div v-if="$rootAccess" class="btn-wrapper">
        <a-button :block="$windowWidth <= 1200" type="primary" size="large" @click="showCreateModal">{{ $locale.userProfilePage.addServiceButtonTitle }}</a-button>
      </div>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="services" :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }" :custom-row="customServicesRow">
      <template #price="{ record }">
        {{ formatPrice(record.price) }}
      </template>
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.homePage.servicesTableEditButtonTitle }}</a-button>
          <a-popconfirm
              v-if="!record.deletedAt"
              :title="$locale.homePage.servicesTableRemoveButtonTitle + '?'"
              @confirm="() => removeService(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.homePage.servicesTableRemoveButtonTitle }}</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-else
              :title="$locale.homePage.servicesTableRestoreButtonTitle + '?'"
              @confirm="() => restoreService(record.id)"
          >
            <a-button type="primary">{{ $locale.homePage.servicesTableRestoreButtonTitle }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-table v-else bordered :data-source="services" :columns="columns" :pagination="{ pageSize: 8 }" :custom-row="customServicesRow">
      <template #price="{ record }">
        {{ formatPrice(record.price) }}
      </template>
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.homePage.servicesTableEditButtonTitle }}</a-button>
          <a-popconfirm
              v-if="!record.deletedAt"
              :title="$locale.homePage.servicesTableRemoveButtonTitle + '?'"
              @confirm="() => removeService(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.homePage.servicesTableRemoveButtonTitle }}</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-else
              :title="$locale.homePage.servicesTableRestoreButtonTitle + '?'"
              @confirm="() => restoreService(record.id)"
          >
            <a-button type="primary">{{ $locale.homePage.servicesTableRestoreButtonTitle }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
        :visible="editModalVisible"
        :title="editModalStateService.title"
        :confirm-loading="editModalConfirmLoading"
        :ok-text="$locale.saveText"
        :onOk="saveService"
        :onCancel="() => editModalVisible = false"
        centered
    >
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.title }}</h6>
        <a-input :disabled="editModalConfirmLoading" class="w-100" v-model:value="editModalState.title" @pressEnter="saveService" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.price }}</h6>
        <a-input-number :disabled="editModalConfirmLoading" type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="editModalState.price" :min="1" @pressEnter="saveService" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.description }}</h6>
        <a-input :disabled="editModalConfirmLoading" class="w-100" v-model:value="editModalState.description" @pressEnter="saveService" />
      </div>
    </a-modal>
    <a-modal
        :visible="createModalVisible"
        :title="$locale.userProfilePage.addServiceButtonTitle"
        :ok-text="$locale.userProfilePage.addServiceButtonTitle"
        :cancel-text="$locale.cancelText"
        :confirm-loading="createModalConfirmLoading"
        :onOk="createService"
        :onCancel="() => createModalVisible = false"
        centered
    >
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.title }}</h6>
        <a-input required :disabled="createModalConfirmLoading" class="w-100" v-model:value="createModalState.title" @pressEnter="createService" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.price }}</h6>
        <a-input-number :disabled="createModalConfirmLoading" type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="createModalState.price" :min="1" @pressEnter="createService" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.homePage.servicesTableHeaders.description }}</h6>
        <a-input :disabled="createModalConfirmLoading" class="w-100" v-model:value="createModalState.description" @pressEnter="createService" />
      </div>
      <a-alert
          class="mt-2"
          v-if="createModalException"
          :message="createModalException"
          type="error"
          :after-close="() => createModalException = ''"
          closable
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {
    SyncOutlined,
    InfoCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons-vue";
import {useStore} from "vuex";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {EditServiceDto, CreateServiceDto, Service, User} from "@/api/services/types";
import {Loader} from "@/utils";
import {formatPrice} from "@/api/utils/formatPrice";
import {ServicesService} from "@/api/services";
import {ApiRole} from "@/api/services/enums/ApiRole";

export default defineComponent({
  name: "VcProfileServices",
  components: {
    SyncOutlined,
    InfoCircleOutlined,
    SearchOutlined,
  },
  setup() {
    const store = useStore();
    const locale = computed(() => store.getters.localeRecord as LocaleRecord);
    const user = computed(() => store.getters.userInfo as User);
    const rootAccess = computed(() => user.value ? user.value.roles.some(role => role.value === ApiRole.Root) : false);

    const services = computed(
        () => showRemovedServices.value && rootAccess.value
          ? (store.getters.removedServices as Array<Service>).filter(service => service.title.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase()))
          : (store.getters.services as Array<Service>).filter(service => service.title.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase()))
    );

    const searchText = ref('');
    const showRemovedServices = ref(false);

    const editModalVisible = ref(false);
    const createModalVisible = ref(false);
    const createModalConfirmLoading = ref(false);
    const editModalConfirmLoading = ref(false);
    const editModalStateService = ref<Service>({
      id: -1,
      title: '',
      description: '',
      price: 0,
    });
    const editModalState = ref<EditServiceDto>({
      title: '',
      price: undefined,
      description: '',
    });
    const createModalState = ref<CreateServiceDto>({
      title: '',
      price: 1,
      description: '',
    });
    const createModalException = ref('');

    const updateServicesList = async () => {
      await Loader.Use(async () => {
        await store.dispatch("updateServices");
      })
    };
    const removeService = async (id: number) => {
      await Loader.Use(async () => {
        const response = await ServicesService.RemoveServicePrivate(id);

        if (response && response.status) {
          await store.dispatch("updateServices");
        }
      });
    }
    const restoreService = async (id: number) => {
      await Loader.Use(async () => {
        const response = await ServicesService.RestoreServicePrivate(id);

        if (response && response.status) {
          await store.dispatch("updateServices");
        }
      });
    }

    const customServicesRow = (record: Service, index: number) => {
      return {};
    };

    const showEditModal = (record: Service) => {
      editModalStateService.value = record;
      editModalState.value.title = record.title;
      editModalState.value.price = record.price;
      editModalState.value.description = record.description;
      editModalVisible.value = true;
    }

    const showCreateModal = (record: Service) => {
      createModalVisible.value = true;
    }

    const saveService = async () => {
      editModalConfirmLoading.value = true;

      const response = await ServicesService.EditServicePrivate(editModalStateService.value!.id, editModalState.value);

      if (response && response.status) {
        await store.dispatch("updateServices");
      }

      editModalStateService.value = {
        id: -1,
        title: '',
        price: 0,
        description: '',
      };
      editModalState.value.title = '';
      editModalState.value.price = 0;
      editModalState.value.description = '';

      editModalConfirmLoading.value = false;
      editModalVisible.value = false;
    }

    const createService = async () => {
      if (!createModalState.value.title) {
        createModalException.value = locale.value.userProfilePage.createServiceModal.exceptions.emptyTitle;
        return;
      }

      if (createModalState.value.price < 1) {
        createModalException.value = locale.value.userProfilePage.createServiceModal.exceptions.zeroOrNegativePrice;
        return;
      }

      createModalConfirmLoading.value = true;

      const response = await ServicesService.CreateServicePrivate(createModalState.value);

      if (response && response.status) {
        await store.dispatch("updateServices");
      }

      createModalState.value.title = '';
      createModalState.value.price = 1;
      createModalState.value.description = '';

      createModalConfirmLoading.value = false;
      createModalVisible.value = false;
    }

    const columns = computed(() => {
      return [
        rootAccess.value
          ? {
              title: locale.value.homePage.servicesTableHeaders.id,
              dataIndex: "id",
              key: "id",
              fixed: !store.getters.mobile ? 'left' : false,
            }
          : null,
        {
          title: locale.value.homePage.servicesTableHeaders.title,
          dataIndex: "title",
          key: "title",
        },
        {
          title: locale.value.homePage.servicesTableHeaders.price,
          dataIndex: "price",
          key: "price",
          align: "right",
          slots: { customRender: "price" },
          customCell() {
            return {
              style: {
                fontWeight: 700,
              },
            };
          },
        },
        {
          title: locale.value.homePage.servicesTableHeaders.description,
          dataIndex: "description",
          key: "description",
        },
        rootAccess.value
          ? {
              title: locale.value.homePage.servicesTableHeaders.actions,
              dataIndex: 'operation',
              key: 'operation',
              align: "right",
              fixed: !store.getters.mobile ? 'right' : false,
              slots: { customRender: 'operation' },
            }
          : null,
      ].filter(record => record);
    });

    onMounted(async () => {
      await updateServicesList();
    });

    return {
      searchText,
      showRemovedServices,
      services,
      columns,
      showEditModal,
      showCreateModal,
      editModalVisible,
      createModalVisible,
      editModalState,
      editModalStateService,
      createModalState,
      editModalConfirmLoading,
      createModalConfirmLoading,
      createModalException,
      saveService,
      createService,
      updateServicesList,
      formatPrice,
      removeService,
      restoreService,
      customServicesRow,
    }
  }
});
</script>

<style lang="less">
@import "ProfileServicesComponent";
</style>