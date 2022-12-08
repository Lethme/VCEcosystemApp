<template>
  <a-layout class="layout flex-grow-1 py-sm-4">
    <div class="container py-sm-4">
      <a-layout-header class="h-auto py-4">
        <div class="container d-flex flex-column justify-content-center align-items-center py-4">
          <div class="img-wrapper col-12 col-sm-8 col-md-6 col-lg-4">
            <img class="img" src="/vc_logo_full.png" alt="">
            <p class="date" v-html="$formattedDate" />
          </div>
        </div>
      </a-layout-header>
      <a-layout class="flex-grow-1 py-4">
<!--        <a-layout-sider>-->
<!--          <p class="date text-start" v-html="$formattedDate" />-->
<!--        </a-layout-sider>-->
        <a-layout-content class="px-4">
          <h4 class="text-start">Current Price List</h4>
          <a-table
              v-if="$windowWidth <= 576"
              :scroll="{ y: 245 }"
              :pagination="{ pageSize: 100 }"
              :dataSource="services"
              :columns="columns"
          />
          <a-table
              v-else
              :dataSource="services"
              :columns="columns"
          />
        </a-layout-content>
      </a-layout>
    </div>
  </a-layout>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue';
import moment from 'moment';
import {Service} from "@/api/services/types";
import {Loader} from "@/utils";
import ServicesService from "@/api/services/ServicesService";

@Options({
  components: {
    HelloWorld,
  },
  data() {
    return {
      services: new Array<Service>(),
      columns: [
        {
          title: "Title",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "Price ₽",
          dataIndex: "price",
          key: "price"
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description"
        },
      ]
    };
  },
  created() {
    Loader.Use(async () => {
      const response = await ServicesService.GetAll();
      if (response.status) {
        this.services = response.data;
      } else {
        this.services = null;
      }
    });
  }
})
export default class HomeView extends Vue {}
</script>

<style lang="less" scoped>
@import '@/var.less';

.img-wrapper {
  .img {
    width: 100%;
  }
}

.date {
  font-size: 1.7em;
  font-weight: 700;
  color: @mainColor;
}
</style>
