<template>
  <a-layout class="layout flex-grow-1 py-sm-4 order-create">
    <div class="container-fluid d-flex py-sm-4">
      <a-layout class="flex-grow-1 w-100 py-4">
        <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between pb-4 pb-md-2">
          <h4 class="text-start d-flex align-items-center gap-3">
            <span>{{ $locale.newOrdersPage.title }}</span>
          </h4>
        </div>
        <a-layout-content>
          <a-tabs class="unselectable" v-model:activeKey="activeKey" type="editable-card" @change="saveState" @edit="paneAction">
            <a-tab-pane class="d-flex flex-column flex-xxl-row justify-content-between gap-3" v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="true">
              <div class="pane-content-wrapper d-flex flex-column justify-content-start flex-grow-1 gap-3">
                <div class="service-select-wrapper d-flex flex-column flex-md-row gap-2 justify-content-start">
                  <a-select
                      v-model:value="activePane.order.selectedService"
                      show-search
                      size="large"
                      placeholder="Select service"
                      @change="() => $store.commit('saveState')"
                      :options="servicesOptions"
                      :filter-option="filterOption"
                      class="text-start col-12 col-md-4 col-lg-3"
                  />
                  <a-button size="large" class="col-12 col-md-auto" @click="refreshServices">{{ $locale.newOrdersPage.refreshServicesButtonTitle }}</a-button>
                  <a-popconfirm
                      :title="$locale.newOrdersPage.clearOrderButtonConfirm"
                      @confirm="clearOrder"
                  >
                    <a-button type="primary" size="large" danger class="col-12 col-md-auto">{{ $locale.newOrdersPage.clearOrderButtonTitle }}</a-button>
                  </a-popconfirm>
                  <a-button type="primary" size="large" class="col-12 col-md-auto" @click="addService">{{ $locale.newOrdersPage.addServiceButtonTitle }}</a-button>
                </div>
                <a-table bordered :data-source="activePane.order.dataSource" :columns="columns" :custom-row="customServicesRow">
                  <template #amount="{ text, record }">
                    <div class="editable-cell"
                         v-on="!activePane.order.dataEditable[record.key] ? {
                           click: () => {
                             edit(record.key);
                           }
                         } : {}"
                    >
                      <div v-if="activePane.order.dataEditable[record.key] && $windowWidth >= 768" class="editable-cell-input-wrapper w-100">
                        <a-input-number type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="activePane.order.dataEditable[record.key].amount" :min="1" @pressEnter="save(record.key)" @keydown.esc="cancel(record.key)" />
                        <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
                      </div>
                      <div v-else class="editable-cell-text-wrapper">
                        {{ text || ' ' }}
                        <edit-outlined :class="{
                          'editable-cell-icon': true,
                          'd-inline-block': activePane.order.dataEditable[record.key] && $windowWidth < 768
                        }" />
                        <a-modal
                            v-if="activePane.order.dataEditable[record.key] && $windowWidth < 768"
                            :visible="activePane.order.dataEditable[record.key] && $windowWidth < 768"
                            :title="record.title"
                            :ok-text="$locale.saveText"
                            @ok="save(record.key)"
                            @cancel="cancel(record.key)"
                            centered
                        >
                          <h6>Amount</h6>
                          <a-input-number type="number" pattern="[0-9]*" inputmode="numeric" class="w-100" v-model:value="activePane.order.dataEditable[record.key].amount" :min="1" @pressEnter="save(record.key)" />
                        </a-modal>
                      </div>
                    </div>
                  </template>
                  <template #operation="{ record }">
                    <a-popconfirm
                        v-if="activePane.order.dataSource.length"
                        :title="$locale.newOrdersPage.orderServicesTableButtonsTitles.removeConfirm"
                        @confirm="removeService(record.key)"
                    >
                      <a-button type="primary" danger>{{ $locale.newOrdersPage.orderServicesTableButtonsTitles.remove }}</a-button>
                    </a-popconfirm>
                  </template>
                </a-table>
              </div>
              <div v-if="activePane.order.dataSource.length" class="pane-sider-wrapper d-flex flex-column col-12 col-xxl-3">
                <h5 class="py-lg-2">{{ $locale.newOrdersPage.orderSummary.title }}</h5>
                <a-card class="text-start" :title="activePane.title">
                  <template #extra>
                    <h4 class="m-0 text-end">{{ formatPrice(activePane.order.totalPrice) }}</h4>
<!--                    <h4 class="m-0 text-end change-value">{{ formatPrice(activePane.order.change) }}</h4>-->
                  </template>
                  <h6 class="pb-1">{{ $locale.newOrdersPage.orderSummary.servicesTitle }}</h6>
                  <a-collapse class="order-services-collapse" v-model:activeKey="activePane.order.summaryActiveKeys" :bordered="false" expand-icon-position="right" @change="() => $store.commit('saveState')">
                    <a-collapse-panel class="text-start service-panel-header" v-for="service in activePane.order.groupedDataSource" :key="service.key" :header="service.title">
                      <div class="summary-service-wrapper d-flex flex-row justify-content-between">
                        <div class="summary-service">
                          <h6 class="summary-service-amount">{{ $locale.newOrdersPage.orderSummary.services.amount }}: <span class="value">{{ service.amount }}</span></h6>
                          <h6 class="summary-service-price m-0">{{ $locale.newOrdersPage.orderSummary.services.price }}: <span class="value">{{ formatPrice(service.price) }}</span></h6>
                        </div>
                        <div class="summary-service-total-price d-flex flex-column justify-content-center align-items-stretch">
                          <h5 class="m-0 value">{{ formatPrice(service.totalPrice) }}</h5>
                        </div>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                  <div class="money-received-wrapper pb-3">
                    <h6 class="pb-1">{{ $locale.newOrdersPage.orderSummary.cash }}</h6>
                    <a-input-number class="w-100" v-model:value="activePane.order.cash" :min="0" @change="saveState" />
                  </div>
                  <a-button type="primary" size="large" block @click="showModal">{{ $locale.newOrdersPage.orderSummary.createOrderButtonTitle }}</a-button>
                </a-card>
              </div>
              <a-modal
                  v-if="activePane.order.dataSource.length"
                  v-model:visible="visible"
                  :title="activePane.title"
                  :confirm-loading="confirmLoading"
                  :ok-text="$locale.newOrdersPage.orderSummary.createOrderModal.createOrderButtonTitle"
                  :cancel-text="$locale.newOrdersPage.orderSummary.createOrderModal.cancelButtonTitle"
                  @ok="handleOk"
                  centered
              >
                <div class="create-order-wrapper d-flex flex-column gap-2">
                  <div class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                    <h5 class="m-0 fw-normal">{{ $locale.newOrdersPage.orderSummary.createOrderModal.servicesColumnTitle }}</h5>
                    <h5 class="m-0">{{ $locale.newOrdersPage.orderSummary.createOrderModal.priceColumnTitle }}</h5>
                  </div>
                  <a-divider />
                  <div :key="service.id" v-for="service in activePane.order.groupedDataSource" class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                    <h6 class="m-0 fw-normal">{{ service.title }}</h6>
                    <h5 class="m-0 value d-flex align-items-center"><span class="fw-normal fs-6">{{ service.amount }} x {{ formatPrice(service.price) }} =&nbsp;</span>{{ formatPrice(service.totalPrice) }}</h5>
                  </div>
                  <a-divider />
                  <div class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                    <h6 class="m-0 fw-normal">{{ $locale.newOrdersPage.orderSummary.createOrderModal.totalPrice }}</h6>
                    <h5 class="m-0 value">{{ formatPrice(activePane.order.totalPrice) }}</h5>
                  </div>
                  <div class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                    <h6 class="m-0 fw-normal">{{ $locale.newOrdersPage.orderSummary.createOrderModal.cash }}</h6>
                    <h5 class="m-0 value">{{ formatPrice(activePane.order.cash) }}</h5>
                  </div>
                  <div class="summary-service-total-price col-12 d-flex flex-row justify-content-between align-items-center">
                    <h6 class="m-0 fw-normal">{{ $locale.newOrdersPage.orderSummary.createOrderModal.change }}</h6>
                    <h5 class="m-0 value">{{ formatPrice(activePane.order.change) }}</h5>
                  </div>
                </div>
              </a-modal>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>
<script lang="ts">
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {computed, ComputedRef, defineComponent, reactive, ref, WritableComputedRef} from 'vue';
import { Service } from "@/api/services/types";
import { OrdersService } from "@/api/services";
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { Pane } from "@/store/modules/orders/types";
import {formatPrice} from "@/api/utils/formatPrice";

export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
  },
  computed: {
    servicesOptions() {
      return this.$store.getters.services.map((s: Service) => ({ label: s.title, value: s.id }));
    },
    columns() {
      return [
        {
          title: this.$locale.newOrdersPage.orderServicesTableHeaders.services,
          dataIndex: 'title',
        },
        {
          title: this.$locale.newOrdersPage.orderServicesTableHeaders.price,
          width: '15%',
          dataIndex: 'price',
          align: 'right',
          customRender({ record }: any) {
            return formatPrice(record.price);
          },
        },
        {
          title: this.$locale.newOrdersPage.orderServicesTableHeaders.totalPrice,
          width: '18%',
          dataIndex: 'totalPrice',
          align: 'right',
          customCell(record: any) {
            return {
              style: {
                fontWeight: 700,
              },
            }
          },
          customRender({ record }: any) {
            return formatPrice(record.totalPrice);
          },
        },
        {
          title: this.$locale.newOrdersPage.orderServicesTableHeaders.amount,
          dataIndex: 'amount',
          width: '30%',
          slots: { customRender: 'amount' },
        },
        {
          title: this.$locale.newOrdersPage.orderServicesTableHeaders.actions,
          dataIndex: 'operation',
          align: "right",
          slots: { customRender: 'operation' },
        },
      ]
    }
  },
  methods: {
    filterOption(input: string, option: any) {
      return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    },
    formatPrice: formatPrice,
  },
  created() {
    this.$store.dispatch("updateServices");
  },
  setup() {
    const store = useStore();
    const locale = computed<LocaleRecord>(() => store.getters.localeRecord);
    const panes = computed<Array<Pane>>(() => store.getters.panes);
    const activeKey: WritableComputedRef<string | undefined> = computed<string | undefined>({
      get() {
        return store.getters.activeKey;
      },
      set(key: string | undefined) {
        store.commit("setActiveKey", key);
      }
    });
    const activePane: ComputedRef<Pane> = computed(() => store.getters.activePane);
    const tabIndex: ComputedRef<number> = computed(() => store.getters.tabIndex);

    /* That's just completely stupid thing
    *  but it works as expected with a little timeout
    *  Idk why but tabs're not being rendered
    *  if you just provide active tab key to it */
    if (panes.value.length) {
      const key = activeKey.value;
      activeKey.value = panes.value[0].key;
      store.commit("setActiveKey", panes.value[0].key);
      setTimeout(() => {
        store.commit("setActiveKey", key);
      }, 1);
    }

    const mobileAmountEditVisible = ref<boolean>(false);

    const visible = ref<boolean>(false);
    const confirmLoading = ref<boolean>(false);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = async () => {
      confirmLoading.value = true;

      const newOrder = activePane.value?.order.uploadDataSource;

      if (newOrder) {
        const response = await OrdersService.Create(newOrder);

        if (response.status) {
          removePane(activePane.value.key);
        }
      }

      visible.value = false;
      confirmLoading.value = false;
    };

    const paneAction = (targetKey: string | MouseEvent, action: string) => {
      store.dispatch("paneAction", {
        key: targetKey,
        action,
      });
    };

    const removePane = (targetKey: string) => {
      store.commit("removePane", activePane.value.key);
    }

    const clearOrder = async () => {
      await store.dispatch("clearOrder");
    }

    if (!panes.value.length) {
      store.commit("addPane");
    }

    const addService = () => {
      store.commit("addOrderService");
    }

    const edit = (key: string) => {
      store.commit("editOrderServiceAmount", key);
    };

    const save = (key: string) => {
      store.commit("saveOrderServiceAmount", key);
    };

    const cancel = (key: string) => {
      store.commit("cancelOrderServiceAmount", key);
    };

    const removeService = (key: string) => {
      store.commit("deleteOrderService", key);
    };

    const saveState = () => {
      Loader.Use(500).then(() => {
        store.commit("saveState");
      });
    }

    const customServicesRow = (record: any, index: number) => {
      return {
        class: {
          editing: activePane.value?.order.dataEditable[record.key],
        },
      }
    };

    const orderSummaryOverflowed = computed(() => activePane.value?.order.groupedDataSource.length > 5);

    return {
      panes,
      activeKey,
      activePane,
      paneAction,
      clearOrder,
      removeService,
      edit,
      save,
      cancel,
      addService,
      saveState,
      customServicesRow,
      orderSummaryOverflowed,
      mobileAmountEditVisible,
      visible,
      confirmLoading,
      showModal,
      handleOk,
    };
  },
});
</script>

<style lang="less">
@import "@/var.less";

.change-value {
  font-size: 1.2em;
}

.summary-service-wrapper {
  .summary-service {
    .summary-service-amount,
    .summary-service-price {
      font-weight: 400;
    }
    .value {
      font-size: 1.1em;
      font-weight: 500;
    }
  }
  .summary-service-total-price {
    .value {
      font-weight: 500;
    }
  }
  .value {
    //color: @mainColor;
    font-weight: 400;
  }
}

.pane-sider-wrapper {
  max-width: 500px;
}

.service-panel-header {
  font-size: 1.1em;
  font-weight: 500;
}

.order-services-collapse {
  max-height: 600px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.order-create .ant-table-row.editing td {
  color: rgba(0, 0, 0, .3);
}

.editable-cell {
  cursor: pointer;
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  [class^='ant-input'] {
    padding: 1px 0 2px 1px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    //display: none;
    display: inline-block;
  }

  .editable-cell-icon-check {
    line-height: 28px;
    color: black;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
//.editable-cell:hover .editable-cell-icon {
//  display: inline-block;
//}
</style>