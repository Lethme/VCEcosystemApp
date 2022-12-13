import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from "ant-design-vue";

import AuthorizedPlugin from "@/plugins/authorized";
import UserPlugin from "@/plugins/user";
import DatePlugin from "@/plugins/date";
import WindowSizePlugin from "@/plugins/windowSize";
import ServicesPlugin from "@/plugins/services";

import 'ant-design-vue/dist/antd.css';
import './fonts.less';
import './var.less';

createApp(App)
    .use(store)
    .use(router)
    .use(antd)
    .use(DatePlugin)
    .use(AuthorizedPlugin)
    .use(UserPlugin)
    .use(WindowSizePlugin)
    .use(ServicesPlugin)
    .mount('#app');
