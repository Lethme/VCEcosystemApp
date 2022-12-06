<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link>
  </nav>
  <router-view/>
  <loader-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoaderView from "@/components/LoaderComponent/LoaderComponent.vue";
import {Loader} from "@/utils";
import {RouteAccess} from "@/router/types";

export default defineComponent({
  components: { LoaderView },
  computed: {},
  created() {
    window.addEventListener("resize", async () => {
      await this.$store.dispatch("updateWindowSize");
    });

    Loader.Use(async () => {
      const response = await this.$store.dispatch("updateUserInfo");

      if (response && !response.status) {
        this.$router.push({
          name: "login",
          state: {
            exception: "Your session has expired",
          },
        });
      }

      if (response && response.status && this.$route.meta.access === RouteAccess.PrivateWhileAuthorized && this.$authorized) {
        this.$router.push("/");
      }
    });
  }
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
