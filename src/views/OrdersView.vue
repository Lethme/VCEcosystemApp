<template>
  <a-layout class="layout flex-grow-1 py-sm-4 orders">
    <div class="container py-sm-4">
      <a-layout class="flex-grow-1 py-4">
        <a-layout-content>
          <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between pb-4 pb-md-2">
            <h4 class="text-start d-flex align-items-center gap-3">
              <span>Orders</span>
              <sync-outlined class="refresh-btn" @click="refreshOrders" />
              <a-switch checked-children="Archive" un-checked-children="Current" v-model:checked="showArchivedOrders" @change="refreshOrders" />
            </h4>
            <div class="btn-wrapper">
              <a-button type="primary" size="large" class="col-12 col-md-auto">
                <router-link to="/orders/create">New Order</router-link>
              </a-button>
            </div>
          </div>
          <a-table class="unselectable" v-model:expanded-row-keys="expandedRowKeys" :data-source="orders" :columns="columns" :expand-row-by-click="true" :custom-row="customOrderRow">
            <template v-slot:expandedRowRender="record">
              <a-table class="unselectable" :data-source="ordersInner.at(record.index)" :key="record.id" :columns="innerColumns" :pagination="false" :custom-row="(r, i) => customOrderServiceRow(record.record, r, i)" />
            </template>
            <template #recordsActions="record">
              <a-button v-if="!showArchivedOrders" type="primary" danger @click="(e) => archiveOrderClick(e, record.record)">Archive</a-button>
              <div class="archive-actions d-flex flex-row gap-2" v-else>
                <a-button type="primary" @click="(e) => restoreOrderClick(e, record.record)">Restore</a-button>
                <a-button type="primary" danger @click="(e) => removeOrderClick(e, record.record)">Remove</a-button>
              </div>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {createVNode, defineComponent} from "vue";
import {QuestionCircleOutlined, SyncOutlined} from '@ant-design/icons-vue';
import {Order, OrderService} from "@/api/services/types";
import {OrdersService} from "@/api/services";
import {Loader} from "@/utils";
import {formatDate} from "@/api/utils/formatDate";
import {Modal} from "ant-design-vue";
import {increaseDateByDays} from "@/api/utils/increaseDateByDays";
import {getDaysBetweenDates} from "@/api/utils/getDaysBetweenDates";

export interface OrderData extends Order {
  key: number;
  price: number;
  payback: number;
  removedIn?: string;
  remaining?: number;
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
      showArchivedOrders: (this.$route.query.archived && this.$route.query.archived == 'true') ? true : false,
      ordersRaw: new Array<Order>(),
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
    columns(): Array<any> {
      const archived = this.showArchivedOrders;

      return [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Money Received (₽)', dataIndex: 'moneyReceived', key: 'moneyReceived' },
        { title: 'Total Price (₽)', dataIndex: "price", key: 'price' },
        { title: 'Payback (₽)', dataIndex: "payback", key: 'payback' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        { title: archived ? 'Deleted At' : 'Updated At', dataIndex: archived ? 'deletedAt' : 'updatedAt', key: archived ? 'deletedAt' : 'updatedAt' },
          archived ? {
            title: 'Removed In', dataIndex: 'removedIn', key: 'removedIn'
          } : null,
          archived ? {
            title: 'Remaining days', dataIndex: 'remaining', key: 'remaining'
          } : null,
        { title: 'Actions', key: 'actions', align: "right", slots: { customRender: "recordsActions" } },
      ].filter(col => col);
    },
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
        const deletedAt = new Date(order.deletedAt as string);
        const currentDate = new Date();

        return {
          ...order,
          key: order.id,
          createdAt: formatDate(new Date(order.createdAt as string)),
          updatedAt: formatDate(new Date(order.updatedAt as string)),
          deletedAt: formatDate(deletedAt),
          removedIn: this.showArchivedOrders
              ? formatDate(
                  increaseDateByDays(
                      currentDate,
                      this.$daysToRemoveOrders - getDaysBetweenDates(deletedAt, currentDate)
                  )
              ) : undefined,
          remaining: this.showArchivedOrders
              ? parseFloat((this.$daysToRemoveOrders - getDaysBetweenDates(deletedAt, currentDate)).toFixed(2))
              : undefined,
          price,
          payback: order.moneyReceived - price,
        }
      })
    }
  },
  methods: {
    async refreshOrders() {
      this.showArchivedOrders
          ? this.$router.push({ query: { archived: 'true' } })
          : this.$router.push({ query: undefined });

      this.ordersRaw = [];

      Loader.SetState(true);

      await this.refreshServices();
      const response = await OrdersService.GetAll({
        deleted: this.showArchivedOrders,
      });

      if (response.status) {
        this.ordersRaw = (response.data as Array<Order>)
            .sort((f, s) => {
              const first = this.showArchivedOrders ? f : s;
              const second = this.showArchivedOrders ? s : f;

              return (new Date(first.createdAt as string)).getTime() - (new Date(second.createdAt as string)).getTime()
            });
      } else {
        this.ordersRaw = [];
      }
    },
    customOrderRow(record: any, index: number) {
      if (!index) {
        Loader.SetState(false);
      }

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
    archiveOrderClick(e: Event, record: OrderData) {
      e.stopPropagation();
      this.showArchiveOrderConfirm(record);
    },
    restoreOrderClick(e: Event, record: OrderData) {
      e.stopPropagation();
      this.showRestoreOrderConfirm(record);
    },
    removeOrderClick(e: Event, record: OrderData) {
      e.stopPropagation();
      this.showRemoveOrderConfirm(record);
    },
    showArchiveOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => 'Archive order confirmation',
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `Do you want to archive order ${record.id}`,
        class: "unselectable",
        centered: true,
        okText: "Archive Order",
        okType: "primary",
        autoFocusButton: "cancel",
        okButtonProps: { danger: true },
        onOk: () => {
          Loader.Use(async () => {
            const response = await OrdersService.Remove(record.id);
            await this.refreshOrders();
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel: () => {},
      });
    },
    showRemoveOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => 'Remove order confirmation',
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `Do you want to completely remove order ${record.id}`,
        class: "unselectable",
        centered: true,
        okText: "Remove Order",
        okType: "primary",
        autoFocusButton: "cancel",
        okButtonProps: { danger: true },
        onOk: () => {
          Loader.Use(async () => {
            const response = await OrdersService.Remove(record.id, true);
            await this.refreshOrders();
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel: () => {},
      });
    },
    showRestoreOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => 'Restore order confirmation',
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `Do you want to restore order ${record.id}`,
        class: "unselectable",
        centered: true,
        okText: "Restore Order",
        okType: "primary",
        autoFocusButton: "cancel",
        onOk: () => {
          Loader.Use(async () => {
            const response = await OrdersService.Restore(record.id);
            await this.refreshOrders();
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
