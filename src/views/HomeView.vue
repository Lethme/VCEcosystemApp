<template>
  <a-layout class="layout flex-grow-1 py-sm-4">
    <div class="container py-sm-4">
      <a-layout-header class="h-auto py-sm-4">
        <div class="container d-flex flex-column justify-content-center align-items-center pt-4 py-sm-4">
          <div class="img-wrapper col-12 col-sm-8 col-md-6 col-lg-4">
            <img class="img" src="/vc_logo_full.png" alt="">
            <p class="date m-0" v-html="$formattedDate" />
          </div>
        </div>
      </a-layout-header>
      <a-layout class="flex-grow-1 py-4">
<!--        <a-layout-sider>-->
<!--          <p class="date text-start" v-html="$formattedDate" />-->
<!--        </a-layout-sider>-->
        <a-layout-content class="px-4">
          <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between">
            <h4 class="text-start d-flex align-items-center gap-3 pb-2">
              <span>Current Price List</span>
              <sync-outlined class="refresh-btn" @click="refreshServices" />
            </h4>
            <div class="input-field col-12 col-md-6 col-lg-5">
              <a-input v-model:value="searchText">
                <template #prefix>
                  <search-outlined />
                </template>
                <template #suffix>
                  <a-tooltip title="Filter by substring included in service title (case insensitive)">
                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                  </a-tooltip>
                </template>
              </a-input>
            </div>
          </div>
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
import { SyncOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import {Service} from "@/api/services/types";

@Options({
  components: {
    SyncOutlined,
    SearchOutlined,
    InfoCircleOutlined
  },
  data() {
    return {
      searchText: "",
      columns: [
        {
          title: "Title",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "Price (₽/unit)",
          dataIndex: "price",
          key: "price"
        },
        // {
        //   title: "Description",
        //   dataIndex: "description",
        //   key: "description"
        // },
      ]
    };
  },
  computed: {
    services() {
      if (this.searchText) {
        return this.$services.filter((s: Service) => s.title.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()));
      }

      return this.$services;
    }
  },
  mounted() {
    this.$store.dispatch("updateServices");
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
  font-size: 1.8em;
  font-weight: 700;
  color: @mainColor;

  @media (max-width: 576px) {
    font-size: 1.5em;
  }
}

.refresh-btn {
  cursor: pointer;
}
</style>
