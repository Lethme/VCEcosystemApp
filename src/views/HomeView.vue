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
import {ApiService, AuthService, UsersService} from "@/api/services";
import {User} from "@/api/services/types";

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {
  async created() {
    const response = await Loader.Use(async () => {
      //return new Promise(r => setTimeout(r, 3000));
      // return await AuthService.Authorize({
      //   username: "root",
      //   password: "root",
      // });

      return await UsersService.WhoAmI();
    });

    if (response.status) {
      const user = response.data as User;
      console.log(user);
    }
  }
}
</script>
