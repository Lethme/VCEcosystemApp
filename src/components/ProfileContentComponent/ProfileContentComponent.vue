<template>
  <h4 v-if="selectedKey === 'profile'">Profile</h4>
  <vc-profile-rates v-if="$rootAccess && selectedKey === 'rates'" />
  <vc-profile-users v-if="$rootAccess && selectedKey === 'users'" />
</template>

<script lang="ts">
import VcProfileRates from "@/components/ProfileRatesComponent/ProfileRatesComponent.vue";
import VcProfileUsers from "@/components/ProfileUsersComponent/ProfileUsersComponent.vue";
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: "VcProfileContent",
  components: {VcProfileRates, VcProfileUsers},
  props: {
    selectedKey: {
      type: String as PropType<string>,
      required: true,
    }
  }
})
</script>

<style lang="less">
@import "ProfileContentComponent";
</style>