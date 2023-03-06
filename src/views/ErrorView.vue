<template>
  <vc-layout class-inner="d-flex flex-column align-items-center justify-content-center gap-2">
    <div class="logo-wrapper py-4 col-12 d-flex justify-content-center">
      <img class="logo-img col-12 col-sm-auto" style="max-width: 300px" src="/vc_logo_full.png" alt="">
    </div>
    <h3>Возникла непредвиденная ошибка</h3>
    <h5>Попробуйте обновить страницу или зайти позже</h5>
    <a-button size="large" type="primary" @click="refresh">Обновить</a-button>
  </vc-layout>
</template>

<script>
import {defineComponent, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const redirect = route.query.redirect;

    store.commit('setLoadingState', false);

    watch(() => store.getters.available, (state) => {
      if (state) {
        router.push({
          path: redirect ?? '/'
        });
      }
    });

    if (store.getters.available) {
      router.push({
        path: redirect ?? '/'
      });
    }

    const refresh = () => {
      router.go(0);
    }

    return {
      refresh,
    }
  },
});
</script>