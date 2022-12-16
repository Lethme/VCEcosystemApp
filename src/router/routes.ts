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
        path: "/orders",
        name: "orders",
        component: () => import('../views/OrdersView.vue'),
        meta: {
            access: RouteAccess.Private,
        }
    },
    {
        path: "/orders/create",
        name: "create_orders",
        component: () => import('../views/CreateOrdersView.vue'),
        meta: {
            access: RouteAccess.Private,
        }
    },
    {
        path: "/confirm/:uuid",
        name: "confirm",
        component: () => import('../views/ConfirmUserView.vue'),
        meta: {
            access: RouteAccess.PrivateWhileAuthorized,
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import('../views/UserProfileView.vue'),
        meta: {
            access: RouteAccess.Private,
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