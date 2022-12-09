<template>
  <a-layout class="layout flex-grow-1 py-sm-4 orders">
    <div class="container py-sm-4">
      <a-layout class="flex-grow-1 py-4">
        <a-layout-content class="px-4">
          <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between">
            <h4 class="text-start d-flex align-items-center gap-3 pb-2">
              <span>Orders</span>
              <sync-outlined class="refresh-btn" @click="refreshOrders" />
            </h4>
            <div class="btn-wrapper">
              <a-button type="primary">Create Order</a-button>
            </div>
          </div>
          <a-table class="unselectable" v-model:expanded-row-keys="expandedRowKeys" :data-source="orders" :columns="columns" :expand-row-by-click="true" :custom-row="customOrderRow">
            <template v-slot:expandedRowRender="record">
              <a-table class="unselectable" :data-source="ordersInner.at(record.index)" :key="record.id" :columns="innerColumns" :pagination="false" :custom-row="(r, i) => customOrderServiceRow(record.record, r, i)" />
            </template>
            <template #recordsActions="record">
              <a-button type="primary" danger @click="(e) => removeOrderClick(e, record.record)">Remove</a-button>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {createVNode, defineComponent, ref} from "vue";
import { SyncOutlined, SearchOutlined, InfoCircleOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import {Order, OrderService, Service} from "@/api/services/types";
import {OrdersService} from "@/api/services";
import {Loader} from "@/utils";
import {formatDate} from "@/api/utils/formatDate";
import {Modal} from "ant-design-vue";

export interface OrderData extends Order {
  key: number;
  price: number;
  payback: number;
}

export interface OrderInnerData extends OrderService {
  totalPrice: number;
}

export default defineComponent({
  components: {
    SyncOutlined,
  },
  data() {
    return {
      expandedRowKeys: [],
      ordersRaw: new Array<Order>(),
      columns: [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Money Received (₽)', dataIndex: 'moneyReceived', key: 'moneyReceived' },
        { title: 'Total Price (₽)', dataIndex: "price", key: 'price' },
        { title: 'Payback (₽)', dataIndex: "payback", key: 'payback' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'Actions', key: 'actions', align: "right", slots: { customRender: "recordsActions" } },
        //{ title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
      ],
      innerColumns: [
        { title: 'Service Id', dataIndex: 'id', key: 'id' },
        { title: 'Service Title', dataIndex: 'title', key: 'title' },
        { title: 'Total Number', dataIndex: 'amount', key: 'amount' },
        { title: 'Price (₽/unit)', dataIndex: 'price', key: 'price' },
        { title: 'Total Price (₽)', dataIndex: 'totalPrice', key: 'totalPrice' },
      ],
    };
  },
  computed: {
    ordersInner(): Array<Array<OrderInnerData>> {
      return this.orders.map((o: OrderData) => o.services.map(service => {
        return {
          ...service,
          totalPrice: service.amount * service.price,
        }
      }))
    },
    orders(): Array<OrderData> {
      return this.ordersRaw.map((order: Order) => {
        const price = order.services.map(service => service.amount * service.price).reduce((prev, cur) => prev + cur);

        return {
          ...order,
          key: order.id,
          createdAt: formatDate(new Date(order.createdAt as string)),
          updatedAt: formatDate(new Date(order.updatedAt as string)),
          price,
          payback: order.moneyReceived - price,
        }
      })
    }
  },
  methods: {
    async refreshOrders() {
      await Loader.Use(async () => {
        await this.refreshServices();
        const response = await OrdersService.GetAll();

        if (response.status) {
          this.ordersRaw = (response.data as Array<Order>)
              .sort((f, s) => (new Date(s.createdAt as string)).getTime() - (new Date(f.createdAt as string)).getTime());
        }
      });
    },
    customOrderRow(record: any, index: number) {
      return {
        class: {
          expanded: this.expandedRowKeys.some(key => key === record.id),
        },
      }
    },
    customOrderServiceRow(orderRecord: OrderData, record: OrderInnerData, index: number) {
      console.log({ orderRecord, record, index });
      return {
        class: {
          test: true,
        }
      }
    },
    removeOrderClick(e: Event, record: OrderData) {
      e.stopPropagation();
      this.showRemoveOrderConfirm(record);
    },
    showRemoveOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => 'Remove order confirmation',
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `Do you want to delete order ${record.id}`,
        class: "unselectable",
        centered: true,
        okText: "Remove Order",
        okType: "primary",
        autoFocusButton: "cancel",
        okButtonProps: { danger: true },
        onOk: () => {
          return new Promise((resolve, reject) => {
            setTimeout((value: unknown) => { console.log(record); this.refreshOrders(); resolve(value) }, 1000);
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel: () => {},
      });
    },
  },
  mounted() {
    this.refreshOrders();
  },
});
</script>

<style lang="less">
.orders .ant-table-row.expanded {
  color: rgba(0, 0, 0, .3);
}

.test-font {
  font-size: 1.7em !important;
}
</style>
