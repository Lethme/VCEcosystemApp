<template>
  <a-layout class="layout flex-grow-1 py-sm-4">
    <div class="container-fluid py-sm-4">
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
          <div class="table-header-wrapper d-flex flex-column flex-md-row justify-content-between align-items-center py-2">
            <h4 class="text-start d-flex align-items-center m-0 gap-3 pb-2">
              <span>{{ $locale.homePage.priceListTitle }}</span>
              <sync-outlined class="refresh-btn" @click="refreshServices" />
            </h4>
            <div class="input-field col-12 col-md-6 col-lg-5">
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
          </div>
          <a-table
              v-if="$mobile"
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
import {formatPrice} from "@/api/utils/formatPrice";

@Options({
  components: {
    SyncOutlined,
    SearchOutlined,
    InfoCircleOutlined
  },
  data() {
    return {
      searchText: "",
    };
  },
  computed: {
    columns() {
      return [
        // {
        //   title: this.$locale.homePage.servicesTableHeaders.id,
        //   dataIndex: "id",
        //   key: "id"
        // },
        {
          title: this.$locale.homePage.servicesTableHeaders.title,
          dataIndex: "title",
          key: "title"
        },
        {
          title: this.$locale.homePage.servicesTableHeaders.price,
          dataIndex: "formattedPrice",
          key: "formattedPrice",
          align: "right",
          customCell() {
            return {
              style: {
                fontWeight: 700,
              },
            };
          },
        },
        {
          title: this.$locale.homePage.servicesTableHeaders.description,
          dataIndex: "description",
          key: "description"
        },
      ]
    },
    services() {
      if (this.searchText) {
        return this.$services.filter((s: Service) => s.title.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase()))
            .map((service: Service) => ({ ...service, formattedPrice: formatPrice(service.price) }));
      }

      return this.$services.map((service: Service) => ({ ...service, formattedPrice: formatPrice(service.price) }));
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
