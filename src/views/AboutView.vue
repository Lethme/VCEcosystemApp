<template>
  <div class="about" style="height: 700px">
    <h1>This is an about page</h1>
    <div class="container">
      <vc-layout :class="{ test: true, con: true }">
        Test
      </vc-layout>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  components: {}
})
</script>
