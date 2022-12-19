<template>
  <a-layout :class="layoutClass">
    <a-layout-content :class="layoutInnerClass">
      <slot />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";

export default defineComponent({
  name: "VcLayout",
  props: {
    class: {
      type: String as PropType<string | object>,
      required: false,
      default() {
        return null;
      },
    },
    classInner: {
      type: String as PropType<string | object>,
      required: false,
      default() {
        return null;
      },
    },
    shadow: {
      type: Boolean as PropType<boolean>,
      required: false,
      default() {
        return true;
      },
    }
  },
  setup(props) {
    const layoutClass = computed(() => {
      return `${(props as any).class ? `${(props as any).class}` : ''} ${(props as any).shadow ? 'shadowed' : ''} vc-layout`;
    });

    const layoutInnerClass = computed(() => {
      return `${(props as any).classInner ? `${(props as any).classInner}` : ''} vc-layout-inner`;
    });

    return {
      layoutClass,
      layoutInnerClass,
    }
  }
})
</script>

<style lang="less">
@import "LayoutComponent";
</style>