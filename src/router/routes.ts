import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import {RouteAccess} from "@/router/types";
import {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            access: RouteAccess.Public,
        }
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: {
            access: RouteAccess.PrivateWhileAuthorized,
        }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: {
            access: RouteAccess.Public,
        }
    }
];

export default routes;