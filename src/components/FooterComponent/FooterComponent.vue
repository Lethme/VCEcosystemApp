<template>
  <a-layout class="flex-grow-0 mt-auto">
    <a-layout-footer>
      <div class="container d-flex flex-column justify-content-center">
        <h6 class="copyright" v-html="$locale.copyright" />
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "VcFooter",
});
</script>

<style lang="less" scoped>
@import 'FooterComponent';
</style>