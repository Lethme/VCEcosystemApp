<template>
  <a-layout class="layout flex-grow-1 py-sm-4">
    <div class="container py-sm-4">
<!--      <a-layout-header class="h-auto py-4">-->
<!--        <div class="container d-flex flex-column justify-content-center align-items-center py-4">-->
<!--          <div class="img-wrapper col-12 col-sm-8 col-md-6 col-lg-4">-->
<!--            <img class="img" src="/vc_logo_full.png" alt="">-->
<!--            <p class="date" v-html="$formattedDate" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </a-layout-header>-->
      <a-layout class="flex-grow-1 py-4">
        <!--        <a-layout-sider>-->
        <!--          <p class="date text-start" v-html="$formattedDate" />-->
        <!--        </a-layout-sider>-->
        <a-layout-content class="px-4">
          <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between">
            <h4 class="text-start d-flex align-items-center gap-3">
              <span>Orders</span>
              <sync-outlined class="refresh-btn" />
            </h4>
<!--            <div class="input-field col-12 col-md-6 col-lg-5">-->
<!--              <a-input v-model:value="searchText">-->
<!--                <template #prefix>-->
<!--                  <search-outlined />-->
<!--                </template>-->
<!--                <template #suffix>-->
<!--                  <a-tooltip title="Filter by substring included in service title (case insensitive)">-->
<!--                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />-->
<!--                  </a-tooltip>-->
<!--                </template>-->
<!--              </a-input>-->
<!--            </div>-->
          </div>
<!--          <a-table-->
<!--              v-if="$windowWidth <= 576"-->
<!--              :scroll="{ y: 245 }"-->
<!--              :pagination="{ pageSize: 100 }"-->
<!--              :dataSource="services"-->
<!--              :columns="columns"-->
<!--          />-->
<!--          <a-table-->
<!--              v-else-->
<!--              :dataSource="services"-->
<!--              :columns="columns"-->
<!--          />-->
<!--          <a-table :columns="columns" :data-source="orders" class="components-table-demo-nested">-->
<!--            <template #expandedRowRender>-->
<!--              <a-table :columns="innerColumns" :data-source="ordersInner" :pagination="false" />-->
<!--            </template>-->
<!--          </a-table>-->

          <a-table :data-source="orders" :columns="columns" :defaultExpandAllRows="true">
            <template v-slot:expandedRowRender="record, index">
              <a-table :data-source="ordersInner.at(index)" :columns="innerColumns" :pagination="false"></a-table>
            </template>
          </a-table>
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { SyncOutlined, SearchOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons-vue';
import {Order} from "@/api/services/types";
import {OrdersService} from "@/api/services";
import {Loader} from "@/utils";

const innerColumns = [
  { title: 'Service Id', dataIndex: 'id', key: 'id' },
  { title: 'Service Title', dataIndex: 'title', key: 'title' },
  { title: 'Total Number', dataIndex: 'amount', key: 'amount' },
  { title: 'Price ₽', dataIndex: 'price', key: 'price' },
];

export default defineComponent({
  components: {
    SyncOutlined,
  },
  data() {
    return {
      orders: new Array<Order>(),
      columns: [
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Money Received', dataIndex: 'moneyReceived', key: 'moneyReceived' },
        { title: 'Total Price', key: 'totalPrice' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
      ]
    };
  },
  computed: {
    ordersInner() {
      return this.orders.map((o: Order) => o.services)
    },
  },
  created() {
    Loader.Use(async () => {
      const response = await OrdersService.GetAll();

      if (response.status) {
        this.orders = response.data as Array<Order>;
      }
    });
  },
  setup() {
    return {
      innerColumns,
    };
  },
});
</script>

<style lang="less">

</style>
