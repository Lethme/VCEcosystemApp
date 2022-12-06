import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from "ant-design-vue";
import Authorized from "@/plugins/authorized";

import 'ant-design-vue/dist/antd.css';

createApp(App).use(store).use(router).use(antd).use(new Authorized()).mount('#app')
