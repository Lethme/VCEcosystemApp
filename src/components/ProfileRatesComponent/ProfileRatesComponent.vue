<template>
  <div class="header-wrapper d-flex pb-3 flex-column flex-md-row gap-3 justify-content-between align-items-center">
    <div class="headers">
      <h6 v-if="$mobile" class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.rates }}
        <sync-outlined class="refresh-btn" @click="updateRatesList" />
      </h6>
      <h4 v-else class="text-start m-0 d-flex align-items-center gap-2">
        {{ $locale.userProfilePage.contentTitles.rates }}
        <sync-outlined class="refresh-btn" @click="updateRatesList" />
      </h4>
    </div>
    <div class="btn-wrapper">
      <a-button type="primary" size="large">{{ $locale.userProfilePage.addRateButtonTitle }}</a-button>
    </div>
  </div>
  <div class="table-wrapper">
    <a-table v-if="$mobile" :row-key="record => record.id" table-layout="auto" bordered :data-source="rates" :columns="columns" :pagination="{ pageSize: 1000 }" :scroll="{ y: 327 }" />
    <a-table v-else bordered :data-source="rates" :columns="columns" :pagination="{ pageSize: 8 }" />
  </div>
</template>

<script lang="ts">
import {RatesService} from "@/api/services";
import {Rate} from "@/api/services/types";
import {LocaleRecord} from "@/store/modules/locales/types/LocaleRecord";
import {Loader} from "@/utils";
import {computed, defineComponent, onMounted, ref} from "vue";
import {
  SyncOutlined
} from "@ant-design/icons-vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "VcProfileRates",
  components: {
    SyncOutlined,
  },
  setup() {
    const store = useStore();
    const locale = computed(() => store.getters.localeRecord as LocaleRecord);
    const rates = ref<Array<Rate>>([]);
    const updateRatesList = async () => {
      await Loader.Use(async () => {
        const response = await RatesService.GetRatesPrivate();

        if (response.status) {
          rates.value = response.data as Array<Rate>;
        } else {
          rates.value = [];
        }
      })
    };

    const columns = computed(() => {
      return [
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
      ]
    });

    onMounted(async () => {
      await updateRatesList();
    });

    return {
      rates,
      columns,
      updateRatesList,
    }
  }
})
</script>

<style lang="less">
@import "ProfileRatesComponent";
</style>