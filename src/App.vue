<template>
  <loader-view />
  <vc-navbar />
  <router-view class="view" />
  <vc-footer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoaderView from "@/components/LoaderComponent/LoaderComponent.vue";
import {Loader} from "@/utils";
import {RouteAccess} from "@/router/types";
import VcFooter from "@/components/FooterComponent/FooterComponent.vue";
import VcNavbar from "@/components/NavbarComponent/NavbarComponent.vue";

export default defineComponent({
  components: {VcNavbar, VcFooter, LoaderView },
  data() {
    return {
      dateIntervalHandler: 0,
    };
  },
  async created() {
    this.dateIntervalHandler = setInterval(async () => {
      await this.$store.dispatch("updateDate");
    }, 1000);

    window.addEventListener("resize", async () => {
      await this.$store.dispatch("updateWindowSize");
    });

    await Loader.Use(async () => {
      await this.$store.dispatch("updateDaysToRemoveOrders");

      const response = await this.$store.dispatch("updateUserInfo");

      if (response && response.status) {
        await this.$store.dispatch("loadState");
      }

      if (response && response.status && this.$route.meta.access === RouteAccess.PrivateWhileAuthorized && this.$authorized) {
        this.$router.push("/");
      }
    });
  },
  unmounted() {
    clearInterval(this.dateIntervalHandler);
  },
});
</script>

<style lang="less">
@import "./global";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
