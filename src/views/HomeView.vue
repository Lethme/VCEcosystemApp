<template>
  <div class="home d-flex flex-column flex-grow-1">
    <a-layout class="layout flex-grow-1 py-4">
      <a-layout-header class="h-auto py-4">
        <div class="container d-flex flex-column justify-content-center align-items-center">
          <div class="img-wrapper col-12 col-sm-8 col-md-6 col-lg-4">
            <img class="img" src="/vc_logo_full.png" alt="">
          </div>
        </div>
      </a-layout-header>
      <a-layout class="flex-grow-1">
        <a-layout-sider>
          <div class="date" v-html="$formattedDate" />
        </a-layout-sider>
        <a-layout-content>Content</a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue';
import moment from 'moment';

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>

<style lang="less">
.img-wrapper {
  .img {
    width: 100%;
  }
}
</style>
