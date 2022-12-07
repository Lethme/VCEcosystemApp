import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from "ant-design-vue";
import AuthorizedPlugin from "@/plugins/authorized";
import UserPlugin from "@/plugins/user";
import DatePlugin from "@/plugins/date";

import 'ant-design-vue/dist/antd.css';

createApp(App)
    .use(store)
    .use(router)
    .use(antd)
    .use(new DatePlugin())
    .use(new AuthorizedPlugin())
    .use(new UserPlugin())
    .mount('#app');
