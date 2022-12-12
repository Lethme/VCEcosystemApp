<template>
  <a-layout class="layout flex-grow-1 py-sm-4 order-create">
    <div class="container d-flex py-sm-4">
      <a-layout class="flex-grow-1 w-100 py-4">
        <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between pb-4 pb-md-2">
          <h4 class="text-start d-flex align-items-center gap-3">
            <span>Create New Orders</span>
          </h4>
        </div>
        <a-layout-content>
          <a-tabs class="unselectable" v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
            <a-tab-pane class="d-flex flex-column flex-xxl-row justify-content-between gap-3" v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="panes.length > 1">
              <div class="pane-content-wrapper d-flex flex-column justify-content-start flex-grow-1 gap-3">
                <div class="service-select-wrapper d-flex flex-column flex-md-row gap-2 justify-content-start">
                  <a-select
                      v-model:value="activePane.order.selectedService"
                      show-search
                      size="large"
                      placeholder="Select service"
                      :options="servicesOptions"
                      :filter-option="filterOption"
                      class="text-start col-12 col-md-4 col-lg-3"
                  />
                  <a-button type="primary" size="large" class="col-12 col-md-auto" @click="addService(activePane.order)">Add Service</a-button>
                </div>
                <a-table bordered :data-source="activePane.order.dataSource" :columns="columns" :custom-row="customServicesRow">
                  <template #amount="{ text, record }">
                    <div class="editable-cell"
                         v-on="!activePane.order.dataEditable[record.key] ? {
                           click: () => {
                             edit(record.key, activePane.order);
                           }
                         } : {}"
                    >
                      <div v-if="activePane.order.dataEditable[record.key]" class="editable-cell-input-wrapper w-100">
                        <a-input-number class="w-100" v-model:value="activePane.order.dataEditable[record.key].amount" :min="1" @pressEnter="save(record.key, activePane.order)" />
                        <check-outlined class="editable-cell-icon-check" @click="save(record.key, activePane.order)" />
                      </div>
                      <div v-else class="editable-cell-text-wrapper">
                        {{ text || ' ' }}
                        <edit-outlined class="editable-cell-icon" />
                      </div>
                    </div>
                  </template>
                  <template #operation="{ record }">
                    <a-popconfirm
                        v-if="activePane.order.dataSource.length"
                        title="Sure to delete?"
                        @confirm="onDelete(record.key, activePane.order)"
                    >
                      <a-button type="primary" danger>Remove</a-button>
                    </a-popconfirm>
                  </template>
                </a-table>
              </div>
              <div v-if="activePane.order.dataSource.length" class="pane-sider-wrapper d-flex flex-column col-12 col-xxl-3">
                <h5 class="py-lg-2">Order Summary</h5>
                <a-card class="text-start" :title="activePane.title">
                  <template #extra>
                    <h4 class="m-0">{{ activePane.order.totalPrice }} ₽</h4>
                  </template>
                  <h6 class="pb-1">Order Services</h6>
                  <a-collapse class="order-services-collapse" v-model:activeKey="orderSummaryActiveKey" :bordered="false" expand-icon-position="right">
                    <a-collapse-panel class="text-start service-panel-header" v-for="service in activePane.order.groupedDataSource" :key="service.key" :header="service.title">
                      <div class="summary-service-wrapper d-flex flex-row justify-content-between">
                        <div class="summary-service">
                          <h6 class="summary-service-amount">Total amount: <span class="value">{{ service.amount }}</span></h6>
                          <h6 class="summary-service-price m-0">Price/Unit: <span class="value">{{ service.price }} ₽</span></h6>
                        </div>
                        <div class="summary-service-total-price d-flex flex-column justify-content-center align-items-stretch">
                          <h5 class="m-0 value">{{ service.totalPrice }} ₽</h5>
                        </div>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                </a-card>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>
<script lang="ts">
import {computed, defineComponent, reactive, Ref, ref, UnwrapRef} from 'vue';
import { cloneDeep } from "lodash-es";
import {Service} from "@/api/services/types";
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import {Loader} from "@/utils";

interface DataItem {
  key: string;
  id: number;
  title: string;
  price: number;
  totalPrice: number;
  amount: number;
}

class OrderState {
  public selectedService?: number = undefined;
  public dataSource: Array<DataItem> = [];
  public dataEditable: Record<string, DataItem> = {};

  public get groupedDataSource() {
    const resultDataSource: Array<DataItem> = [];

    for (let i = 0; i < this.dataSource.length; i++) {
      const item = this.dataSource[i];
      const groupedItemIndex = resultDataSource.findIndex(resultItem => resultItem.id === item.id);

      if (groupedItemIndex !== -1) {
        resultDataSource[groupedItemIndex].amount += item.amount;
        resultDataSource[groupedItemIndex].totalPrice += item.totalPrice;
      } else {
        resultDataSource.push({ ...item });
      }
    }

    return resultDataSource;
  }

  public get totalPrice() {
    return this.dataSource.map(item => item.totalPrice).reduce((cur, next) => cur + next);
  }

  public getItemByKey(key: string) {
    return this.dataSource.find(item => item.key === key);
  }

  public getItemIndexByKey(key: string) {
    return this.dataSource.findIndex(item => item.key === key);
  }

  constructor() {
    /* ToDo */
  }
}

interface Pane {
  title: string;
  key: string;
  order: Ref<OrderState>;
}

export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
  },
  computed: {
    servicesOptions() {
      return this.$store.getters.services.map((s: Service) => ({ label: s.title, value: s.id }));
    },
  },
  methods: {
    filterOption(input: string, option: any) {
      return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    },
  },
  mounted() {
    this.$store.dispatch("updateServices");
  },
  setup() {
    const panes = ref<Array<Pane>>([]);
    const activeKey = ref<string | undefined>();
    const activePane = computed(() => panes.value.find(pane => pane.key === activeKey.value));
    const newTabIndex = ref(1);
    const orderSummaryActiveKey = ref<Array<string>>([]);
    const store = useStore();

    const add = () => {
      activeKey.value = `newOrder${newTabIndex.value}`;
      panes.value.push({ title: `New Order (${newTabIndex.value})`, order: reactive(new OrderState()), key: activeKey.value });
      newTabIndex.value++;
    };

    const remove = (targetKey: string) => {
      let lastIndex = 0;
      panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      panes.value = panes.value.filter(pane => pane.key !== targetKey);
      if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
          activeKey.value = panes.value[lastIndex].key;
        } else {
          activeKey.value = panes.value[0].key;
        }
      }
    };

    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === 'add') {
        add();
      } else {
        remove(targetKey as string);
      }
    };

    add();

    const columns = [
      {
        title: 'Service',
        dataIndex: 'title',
      },
      {
        title: 'Price (₽/unit)',
        width: '15%',
        dataIndex: 'price',
      },
      {
        title: 'Total Price (₽)',
        width: '18%',
        dataIndex: 'totalPrice',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        width: '30%',
        slots: { customRender: 'amount' },
      },
      {
        title: 'Actions',
        dataIndex: 'operation',
        align: "right",
        slots: { customRender: 'operation' },
      },
    ];

    const addService = (order: OrderState) => {
      if (order.selectedService) {
        const service: Service = store.getters.services.find((s: Service) => s.id === order.selectedService);

        order.dataSource.push({
          key: order.dataSource.length.toString(),
          id: service.id,
          title: service.title,
          price: service.price,
          totalPrice: service.price,
          amount: 1,
        });
      }
    }

    const edit = (key: string, order: OrderState) => {
      order.dataEditable[key] = cloneDeep(order.dataSource.filter(item => key === item.key)[0]);
    };

    const save = (key: string, order: OrderState) => {
      Object.assign(order.dataSource.filter(item => key === item.key)[0], order.dataEditable[key]);
      delete order.dataEditable[key];

      const itemIndex = order.getItemIndexByKey(key);
      if (itemIndex !== -1) {
        order.dataSource[itemIndex].totalPrice = order.dataSource[itemIndex].amount * order.dataSource[itemIndex].price;
      }
    };

    const onDelete = (key: string, order: OrderState) => {
      order.dataSource = order.dataSource.filter(item => item.key !== key);
    };

    const customServicesRow = (record: any, index: number) => {
      return {
        class: {
          editing: activePane.value?.order.dataEditable[record.key],
        },
      }
    };

    const orderSummaryOverflowed = computed(() => activePane.value!.order!.groupedDataSource.length > 5);

    return {
      panes,
      activeKey,
      activePane,
      onEdit,
      columns,
      onDelete,
      edit,
      save,
      addService,
      orderSummaryActiveKey,
      customServicesRow,
      orderSummaryOverflowed,
    };
  },
});
</script>

<style lang="less">
@import "@/var.less";

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

.service-panel-header {
  font-size: 1.1em;
  font-weight: 500;
}

.order-services-collapse {
  max-height: 600px;
  overflow-y: auto;
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
    display: none;
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
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>