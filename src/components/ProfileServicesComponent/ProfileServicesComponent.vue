<template>
  <div class="header-wrapper d-flex pb-3 flex-column flex-xl-row gap-3 justify-content-between align-items-center">
    <div class="headers col-12 col-xl-auto">
      <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.services }}
        <sync-outlined class="refresh-btn" @click="updateServicesList" />
      </h6>
      <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.services }}
        <sync-outlined class="refresh-btn" @click="updateServicesList" />
      </h4>
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
        <a-button :block="$windowWidth <= 1200" type="primary" size="large">{{ $locale.userProfilePage.addServiceButtonTitle }}</a-button>
      </div>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="services" :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }">
      <template #price="{ record }">
        {{ formatPrice(record.price) }}
      </template>
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.homePage.servicesTableEditButtonTitle }}</a-button>
          <a-popconfirm
              :title="$locale.homePage.servicesTableRemoveButtonTitle + '?'"
              @confirm="() => removeService(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.homePage.servicesTableRemoveButtonTitle }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-table v-else bordered :data-source="services" :columns="columns" :pagination="{ pageSize: 8 }">
      <template #price="{ record }">
        {{ formatPrice(record.price) }}
      </template>
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex justify-content-end gap-2">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.homePage.servicesTableEditButtonTitle }}</a-button>
          <a-popconfirm
              :title="$locale.homePage.servicesTableRemoveButtonTitle + '?'"
              @confirm="() => removeService(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.homePage.servicesTableRemoveButtonTitle }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
        :visible="editModalVisible"
        :title="editModalStateService.title"
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
import {PatchServiceDto, PostServiceDto, Service, User} from "@/api/services/types";
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

    const services = computed(() => (store.getters.services as Array<Service>).filter(service => service.title.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())));

    const searchText = ref('');

    const editModalVisible = ref(false);
    const createModalVisible = ref(false);
    const createModalConfirmLoading = ref(false);
    const editModalStateService = ref<Service>({
      id: -1,
      title: '',
      description: '',
      price: 0,
    });
    const editModalConfirmLoading = ref(false);
    const editModalState = ref<PatchServiceDto>({
      title: '',
      price: undefined,
      description: '',
    });
    const createModalState = ref<PostServiceDto>({
      title: '',
      price: 0,
      description: '',
    });
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

    const showEditModal = (record: Service) => {
      editModalStateService.value = record;
      editModalState.value.title = record.title;
      editModalState.value.price = record.price;
      editModalState.value.description = record.description;
      editModalVisible.value = true;
    }

    const showCreateModal = (record: Service) => {
      /* ToDo */
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
      saveService,
      updateServicesList,
      formatPrice,
      removeService,
    }
  }
});
</script>

<style lang="less">
@import "ProfileServicesComponent";
</style>