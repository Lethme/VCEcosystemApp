<template>
  <div :class="loaderClasses">
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "LoaderView",
  computed: {
    loaderClasses() {
      return {
        "loader-view": true,
        "loading": this.$store.getters.loading,
      };
    },
  }
})
</script>

<style scoped lang="less">
@import "LoaderComponent";
</style>