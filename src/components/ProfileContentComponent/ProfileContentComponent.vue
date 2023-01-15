<template>
  <h4 v-if="selectedKey === menuKeys.profile.key">Profile</h4>
  <vc-profile-preferences v-if="selectedKey === menuKeys.preferences.key && $operatorAccess" />
  <vc-profile-services v-if="selectedKey === menuKeys.services.key" />
  <vc-profile-rates v-if="$rootAccess && selectedKey === menuKeys.rates.key" />
  <vc-profile-users v-if="$rootAccess && selectedKey === menuKeys.users.key" />
</template>

<script lang="ts">
import VcProfilePreferences from "@/components/ProfilePreferencesComponent/ProfilePreferencesComponent.vue";
import VcProfileRates from "@/components/ProfileRatesComponent/ProfileRatesComponent.vue";
import VcProfileUsers from "@/components/ProfileUsersComponent/ProfileUsersComponent.vue";
import {defineComponent, PropType} from "vue";
import {MenuKeyState} from "@/views/UserProfileView.vue";
import VcProfileServices from "@/components/ProfileServicesComponent/ProfileServicesComponent.vue";

export default defineComponent({
  name: "VcProfileContent",
  components: {VcProfilePreferences, VcProfileServices, VcProfileRates, VcProfileUsers},
  props: {
    selectedKey: {
      type: String as PropType<string>,
      required: true,
    },
    menuKeys: {
      type: Object as PropType<MenuKeyState>,
      required: true,
    },
  }
})
</script>

<style lang="less">
@import "ProfileContentComponent";
</style>