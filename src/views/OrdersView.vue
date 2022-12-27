<template>
  <a-layout class="layout flex-grow-1 py-sm-4 orders">
    <div class="container-fluid py-sm-4">
      <a-layout class="flex-grow-1 py-4">
        <a-layout-content>
          <div class="table-header-wrapper d-flex flex-column flex-sm-row gap-3 gap-sm-2 justify-content-between pb-4 pb-md-2">
            <h4 class="text-start d-flex align-items-center m-0 gap-3">
              <span>{{ $locale.ordersPage.title }}</span>
              <sync-outlined class="refresh-btn" @click="refreshOrders" />
              <a-switch :checked-children="$locale.ordersPage.archivedSwitch.checked" :un-checked-children="$locale.ordersPage.archivedSwitch.unchecked" v-model:checked="showArchivedOrders" @change="refreshOrders" />
              <a-switch v-if="$rootAccess" :checked-children="$locale.ordersPage.allOrdersSwitch.checked" :un-checked-children="$locale.ordersPage.allOrdersSwitch.unchecked" v-model:checked="showAllOrders" @change="refreshOrders" />
            </h4>
            <div class="btn-wrapper">
              <a-button type="primary" :size="$windowWidth >= 576 ? 'large' : 'default'" class="d-flex align-items-center gap-2 col-12 col-sm-auto">
                <template #icon>
                  <plus-outlined />
                </template>
                <router-link to="/orders/create" @click="newOrder" style="color: white">{{ $locale.ordersPage.newOrderButtonTitle }}</router-link>
              </a-button>
            </div>
          </div>
          <a-table class="unselectable" v-model:expanded-row-keys="expandedRowKeys" :data-source="orders" :columns="columns" :expand-row-by-click="true" :custom-row="customOrderRow">
            <template v-slot:expandedRowRender="record">
              <a-table class="unselectable" :data-source="ordersInner.at(record.index)" :key="record.id" :columns="innerColumns" :pagination="false" :custom-row="(r, i) => customOrderServiceRow(record.record, r, i)" />
            </template>
            <template #recordsActions="record">
              <a-button v-if="!showArchivedOrders" type="primary" danger @click="(e) => archiveOrderClick(e, record.record)">{{ $locale.ordersPage.ordersTableActions.archiveButtonTitle }}</a-button>
              <div class="archive-actions d-flex flex-row gap-2" v-else>
                <a-button type="primary" @click="(e) => restoreOrderClick(e, record.record)">{{ $locale.ordersPage.ordersTableActions.restoreButtonTitle }}</a-button>
                <a-button type="primary" danger @click="(e) => removeOrderClick(e, record.record)">{{ $locale.ordersPage.ordersTableActions.removeButtonTitle }}</a-button>
              </div>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {Pane} from "@/store/modules/orders/types";
import {createVNode, defineComponent} from "vue";
import {QuestionCircleOutlined, SyncOutlined, PlusOutlined} from '@ant-design/icons-vue';
import {Order, OrderService, User} from "@/api/services/types";
import {OrdersService} from "@/api/services";
import {Loader} from "@/utils";
import {formatDate} from "@/api/utils/formatDate";
import {Modal} from "ant-design-vue";
import {increaseDateByDays} from "@/api/utils/increaseDateByDays";
import {getDaysBetweenDates} from "@/api/utils/getDaysBetweenDates";
import {getFullUsername} from "@/api/utils/getFullUsername";
import {formatPrice} from "@/api/utils/formatPrice";

export interface OrderData extends Order {
  key: number;
  cash: string;
  price: string;
  change: string;
  removedIn?: string;
  remaining?: number;
  username?: string;
}

export interface OrderInnerData extends OrderService {
  totalPrice: string;
  unitPrice: string;
}

export default defineComponent({
  components: {
    SyncOutlined,
    PlusOutlined,
  },
  data() {
    return {
      expandedRowKeys: [],
      showArchivedOrders: (this.$route.query.archived && this.$route.query.archived == 'true') ? true : false,
      showAllOrders: (this.$route.query.all && this.$route.query.all == 'true') ? true : false,
      ordersRaw: new Array<Order>(),
    };
  },
  computed: {
    columns(): Array<any> {
      return [
        { title: this.$locale.ordersPage.ordersTableHeaders.id, dataIndex: 'id', key: 'id' },
        { title: this.$locale.ordersPage.ordersTableHeaders.totalPrice, dataIndex: "price", key: 'price', align: "right", customCell(record: any) {
            return {
              style: {
                fontWeight: 700,
              },
            };
        }},
        { title: this.$locale.ordersPage.ordersTableHeaders.cash, dataIndex: 'cash', key: 'cash', align: 'right' },
        { title: this.$locale.ordersPage.ordersTableHeaders.change, dataIndex: "change", key: 'change', align: 'right' },
        { title: this.$locale.ordersPage.ordersTableHeaders.createdAt, dataIndex: 'createdAt', key: 'createdAt', align: 'right' },
        // { title: archived ? 'Deleted At' : 'Updated At', dataIndex: archived ? 'deletedAt' : 'updatedAt', key: archived ? 'deletedAt' : 'updatedAt' },
          this.$rootAccess && this.showAllOrders ? {
            title: this.$locale.ordersPage.ordersTableHeaders.user, dataIndex: 'username', key: 'username', align: 'right'
          } : null,
          this.showArchivedOrders ? {
            title: this.$locale.ordersPage.ordersTableHeaders.removedIn, dataIndex: 'removedIn', key: 'removedIn', align: 'right'
          } : null,
          this.showArchivedOrders ? {
            title: this.$locale.ordersPage.ordersTableHeaders.remainingDays, dataIndex: 'remaining', key: 'remaining', align: 'right'
          } : null,
        { title: this.$locale.ordersPage.ordersTableHeaders.actions, key: 'actions', align: "right", slots: { customRender: "recordsActions" } },
      ].filter(col => col);
    },
    innerColumns(): Array<any> {
      return [
        { title: this.$locale.ordersPage.ordersServicesTableHeaders.id, dataIndex: 'id', key: 'id' },
        { title: this.$locale.ordersPage.ordersServicesTableHeaders.title, dataIndex: 'title', key: 'title' },
        { title: this.$locale.ordersPage.ordersServicesTableHeaders.amount, dataIndex: 'amount', key: 'amount', align: 'right' },
        { title: this.$locale.ordersPage.ordersServicesTableHeaders.price, dataIndex: 'unitPrice', key: 'unitPrice', align: 'right' },
        { title: this.$locale.ordersPage.ordersServicesTableHeaders.totalPrice, dataIndex: 'totalPrice', key: 'totalPrice', align: 'right', customCell(record: any) {
            return {
              style: {
                fontWeight: 700,
              },
            };
          }},
      ];
    },
    ordersInner(): Array<Array<OrderInnerData>> {
      return this.orders.map((o: OrderData) => o.services.map(service => {
        return {
          ...service,
          unitPrice: formatPrice(service.price),
          totalPrice: formatPrice(service.amount * service.price),
        }
      }).sort((f, s) => f.id - s.id));
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
          cash: formatPrice(order.moneyReceived),
          price: formatPrice(price),
          change: formatPrice(order.moneyReceived - price),
          username: getFullUsername(order.user),
        }
      })
    },
  },
  methods: {
    async refreshOrders() {
      this.$router.push({
        query: {
          ...this.$route.query,
          archived: this.showArchivedOrders ? 'true' : undefined,
          all: this.showAllOrders ? 'true' : undefined,
        }
      });

      this.ordersRaw = [];

      Loader.SetState(true);

      await this.refreshServices();
      await this.loadOrders();
    },
    async loadOrders() {
      const response = this.$rootAccess && this.showAllOrders
          ? await OrdersService.GetAllPrivate({ deleted: this.showArchivedOrders })
          : await OrdersService.GetAll({ deleted: this.showArchivedOrders });


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
        title: () => this.$locale.ordersPage.modals.archive.title,
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `${this.$locale.ordersPage.modals.archive.content} #${record.id}?`,
        class: "unselectable",
        centered: true,
        okText: "Archive Order",
        okType: "primary",
        autoFocusButton: "cancel",
        okButtonProps: { danger: true },
        onOk: () => {
          Loader.Use(async () => {
            const response = this.$rootAccess && this.showAllOrders
                ? await OrdersService.RemovePrivate(record.id)
                : await OrdersService.Remove(record.id);
            await this.refreshOrders();
          });
        },
      });
    },
    showRemoveOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => this.$locale.ordersPage.modals.remove.title,
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `${this.$locale.ordersPage.modals.remove.content} #${record.id}?`,
        class: "unselectable",
        centered: true,
        okText: "Remove Order",
        okType: "primary",
        autoFocusButton: "cancel",
        okButtonProps: { danger: true },
        onOk: () => {
          Loader.Use(async () => {
            const response = this.$rootAccess && this.showAllOrders
                ? await OrdersService.RemovePrivate(record.id, true)
                : await OrdersService.Remove(record.id, true);
            await this.refreshOrders();
          });
        },
      });
    },
    showRestoreOrderConfirm(record: OrderData) {
      Modal.confirm({
        title: () => this.$locale.ordersPage.modals.restore.title,
        icon: () => createVNode(QuestionCircleOutlined),
        content: () => `${this.$locale.ordersPage.modals.restore.content} #${record.id}?`,
        class: "unselectable",
        centered: true,
        okText: "Restore Order",
        okType: "primary",
        autoFocusButton: "cancel",
        onOk: () => {
          Loader.Use(async () => {
            const response = this.$rootAccess && this.showAllOrders
                ? await OrdersService.RestorePrivate(record.id)
                : await OrdersService.Restore(record.id);
            await this.refreshOrders();
          });
        },
      });
    },
    newOrder() {
      const panes = this.$store.getters.panes as Array<Pane>;

      if (panes.length === 1 && panes[0].order.empty) {
        return;
      }

      this.$store.commit("addPane");
    }
  },
  watch: {
    $rootAccess(current: boolean, old: boolean) {
      if (current) {
        this.loadOrders();
      }
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
