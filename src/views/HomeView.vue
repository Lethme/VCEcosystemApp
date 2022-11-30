<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue';
import { Loader } from "@/utils";
import axios from "axios";
import {ApiService} from "@/api/services";

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  created() {
    Loader.Use(async () => {
      //return new Promise(r => setTimeout(r, 3000));
      return await axios.get(ApiService.CreateApiRequestUrl({
        path: ["gkassa", "services"]
      }).Url);
    }).then(response => {
      console.log(response);
    });
  }
}
</script>
