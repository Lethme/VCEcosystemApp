import moment from "moment";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from "ant-design-vue";
import LayoutComponent from "@/components/LayoutComponent";
import ProfilePictureComponent from "@/components/ProfilePictureComponent";

import AuthorizedPlugin from "@/plugins/authorized";
import UserPlugin from "@/plugins/user";
import DatePlugin from "@/plugins/date";
import WindowSizePlugin from "@/plugins/windowSize";
import ServicesPlugin from "@/plugins/services";
import UtilsPlugin from "@/plugins/utils";
import LocalesPlugin from "@/plugins/locales";
import NotificationsPlugin from "@/plugins/notifications";

import 'ant-design-vue/dist/antd.css';
import './fonts.less';
import './var.less';

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const app = createApp(App);

app.component("VcLayout", LayoutComponent);
app.component("VcProfilePicture", ProfilePictureComponent);

app
    .use(store)
    .use(router)
    .use(antd)
    .use(DatePlugin)
    .use(AuthorizedPlugin)
    .use(UserPlugin)
    .use(WindowSizePlugin)
    .use(ServicesPlugin)
    .use(UtilsPlugin)
    .use(LocalesPlugin)
    .use(NotificationsPlugin)
    .mount('#app');
