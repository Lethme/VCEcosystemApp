<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view/>
  <loader-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoaderView from "@/components/LoaderComponent/LoaderComponent.vue";
import {Vue} from "vue-class-component";
import {Loader} from "@/utils";

export default defineComponent({
  components: { LoaderView },
  computed: {
    loading() {
      return this.$store.getters.loading;
    }
  },
  created() {
    window.addEventListener("resize", async () => {
      await this.$store.dispatch("updateWindowSize");
    });

    Loader.Use(async () => {
      await this.$store.dispatch("updateUserData");
    });
  }
});
</script>

<style lang="less">
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
