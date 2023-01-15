<template>
  <div class="header-wrapper d-flex pb-3 flex-column flex-xxl-row gap-3 justify-content-between align-items-center">
    <div class="headers d-flex gap-3 align-items-center col-12 col-xxl-auto">
      <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.rates }}
        <sync-outlined class="refresh-btn" @click="updateRatesList" />
      </h6>
      <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.rates }}
        <sync-outlined class="refresh-btn" @click="updateRatesList" />
      </h4>
      <a-switch v-if="$rootAccess" :checked-children="$locale.userProfilePage.removedRatesSwitch.checked" :un-checked-children="$locale.userProfilePage.removedRatesSwitch.unchecked" v-model:checked="showRemovedRates" @change="updateRatesList" />
    </div>
    <div class="actions-wrapper d-flex flex-column flex-xxl-row gap-3 gap-xxl-2 col-12 col-xxl-6">
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
      <div class="btn-wrapper">
        <a-button :block="$windowWidth <= 1400" type="primary" size="large" @click="showCreateModal">{{ $locale.userProfilePage.addRateButtonTitle }}</a-button>
      </div>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="rates" :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }">
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex gap-2 justify-content-end">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.editText }}</a-button>
          <a-popconfirm
              v-if="!record.deletedAt"
              :title="$locale.removeText + '?'"
              @confirm="() => removeRate(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.removeText }}</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-else
              :title="$locale.restoreText + '?'"
              @confirm="() => restoreRate(record.id)"
          >
            <a-button type="primary">{{ $locale.restoreText }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-table v-else bordered :data-source="rates" :columns="columns" :pagination="{ pageSize: 8 }">
      <template #operation="{ record }">
        <div class="btn-wrapper d-flex gap-2 justify-content-end">
          <a-button type="primary" @click="() => showEditModal(record)">{{ $locale.editText }}</a-button>
          <a-popconfirm
              v-if="!record.deletedAt"
              :title="$locale.removeText + '?'"
              @confirm="() => removeRate(record.id)"
          >
            <a-button type="primary" danger>{{ $locale.removeText }}</a-button>
          </a-popconfirm>
          <a-popconfirm
              v-else
              :title="$locale.restoreText + '?'"
              @confirm="() => restoreRate(record.id)"
          >
            <a-button type="primary">{{ $locale.restoreText }}</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <a-modal
        :visible="createModalVisible"
        :title="$locale.userProfilePage.addRateButtonTitle"
        :ok-text="$locale.userProfilePage.addRateButtonTitle"
        :cancel-text="$locale.cancelText"
        :confirm-loading="createModalConfirmLoading"
        :onOk="createRate"
        :onCancel="() => createModalVisible = false"
        centered
    >
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.userProfilePage.ratesTableHeaders.title }}</h6>
        <a-input required :disabled="createModalConfirmLoading" class="w-100" v-model:value="createModalState.title" @pressEnter="createRate" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.userProfilePage.ratesTableHeaders.rate }}</h6>
        <a-input-number :disabled="createModalConfirmLoading" type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="createModalState.rate" :min="1" @pressEnter="createRate" />
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
    <a-modal
        :visible="editModalVisible"
        :title="editModalStateRate.title"
        :confirm-loading="editModalConfirmLoading"
        :ok-text="$locale.saveText"
        :onOk="saveRate"
        :onCancel="() => editModalVisible = false"
        centered
    >
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.userProfilePage.ratesTableHeaders.title }}</h6>
        <a-input size="large" required :disabled="createModalConfirmLoading" class="w-100" v-model:value="editModalState.title" @pressEnter="saveRate" />
      </div>
      <div class="input-wrapper d-flex flex-column align-items-start py-2">
        <h6>{{ $locale.userProfilePage.ratesTableHeaders.rate }}</h6>
        <a-input-number size="large" :disabled="createModalConfirmLoading" type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="editModalState.rate" :min="1" @pressEnter="saveRate" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {RatesService} from "@/api/services";
import {CreateRateDto, Rate} from "@/api/services/types";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {computed, defineComponent, onMounted, ref} from "vue";
import {
    SyncOutlined,
    SearchOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons-vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "VcProfileRates",
  components: {
    SyncOutlined,
    SearchOutlined,
    InfoCircleOutlined,
  },
  setup() {
    const store = useStore();
    const locale = computed(() => store.getters.localeRecord as LocaleRecord);
    const rates = computed(() =>
        showRemovedRates.value
          ? ratesRaw.value.filter(rate => rate.deletedAt && rate.title.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase()))
          : ratesRaw.value.filter(rate => !rate.deletedAt && rate.title.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase()))
    );
    const ratesRaw = ref<Array<Rate>>([]);
    const updateRatesList = async (useLoader = true) => {
      useLoader && Loader.SetState(true);

      const response = await RatesService.GetRatesPrivate(true);

      if (response.status) {
        ratesRaw.value = response.data as Array<Rate>;
      } else {
        ratesRaw.value = [];
      }

      useLoader && Loader.SetState(false);
    };

    const showRemovedRates = ref(false);
    const searchText = ref('');

    const createModalVisible = ref(false);
    const createModalConfirmLoading = ref(false);
    const createModalException = ref('');
    const createModalState = ref<CreateRateDto>({
      title: '',
      rate: 1,
    });

    const editModalVisible = ref(false);
    const editModalConfirmLoading = ref(false);
    const editModalException = ref('');
    const editModalStateRate = ref<Rate>({
      id: -1,
      title: '',
      rate: 1,
    });
    const editModalState = ref<CreateRateDto>({
      title: '',
      rate: 1,
    });

    const createRate = async () => {
      if (!createModalState.value.title) {
        createModalException.value = locale.value.userProfilePage.createRateModal.exceptions.emptyTitle;
        return;
      }

      createModalConfirmLoading.value = true;

      const response = await RatesService.CreateRatePrivate(createModalState.value);

      if (response && response.status) {
        await updateRatesList(false);
      }

      createModalState.value.title = '';
      createModalState.value.rate = 1;

      createModalConfirmLoading.value = false;
      createModalVisible.value = false;
    }

    const saveRate = async () => {
      editModalConfirmLoading.value = true;

      const response = await RatesService.EditRatePrivate(editModalStateRate.value.id, editModalState.value);

      if (response && response.status) {
        await updateRatesList(false);
      }

      editModalStateRate.value = {
        id: -1,
        title: '',
        rate: 1,
      }
      editModalState.value.title = '';
      editModalState.value.rate = 1;

      editModalConfirmLoading.value = false;
      editModalVisible.value = false;
    }

    const showCreateModal = () => {
      createModalState.value.title = '';
      createModalState.value.rate = 1;
      createModalVisible.value = true;
    }

    const showEditModal = (rate: Rate) => {
      editModalStateRate.value = rate;
      editModalState.value.title = rate.title;
      editModalState.value.rate = rate.rate;
      editModalVisible.value = true;
    }

    const removeRate = async (id: number) => {
      await Loader.Use(async () => {
        const response = await RatesService.RemoveRatePrivate(id);

        if (response && response.status) {
          await updateRatesList();
        }
      });
    }

    const restoreRate = async (id: number) => {
      await Loader.Use(async () => {
        const response = await RatesService.RestoreRatePrivate(id);

        if (response && response.status) {
          await updateRatesList();
        }
      });
    }

    const columns = computed(() => {
      return [
        {
          title: locale.value.userProfilePage.ratesTableHeaders.id,
          dataIndex: 'id',
          key: 'id',
          fixed: !store.getters.mobile ? 'left' : false,
        },
        {
          title: locale.value.userProfilePage.ratesTableHeaders.title,
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: locale.value.userProfilePage.ratesTableHeaders.rate,
          dataIndex: 'rate',
          key: 'rate',
        },
        {
          title: locale.value.userProfilePage.ratesTableHeaders.actions,
          dataIndex: 'operation',
          key: 'operation',
          align: 'right',
          fixed: !store.getters.mobile ? 'right' : false,
          slots: { customRender: 'operation' }
        },
      ]
    });

    onMounted(async () => {
      await updateRatesList();
    });

    return {
      rates,
      columns,
      showRemovedRates,
      searchText,
      removeRate,
      restoreRate,
      updateRatesList,
      showCreateModal,
      showEditModal,
      createRate,
      saveRate,
      createModalVisible,
      createModalConfirmLoading,
      createModalException,
      createModalState,
      editModalVisible,
      editModalConfirmLoading,
      editModalException,
      editModalState,
      editModalStateRate,
    }
  }
})
</script>

<style lang="less">
@import "ProfileRatesComponent";
</style>