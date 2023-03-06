import {RouteAccess} from "@/router/types";
import LoginView from "@/views/LoginView.vue";
import {RouteRecordRaw} from "vue-router";
import HomeView from '../views/HomeView.vue'

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
    },
    {
        path: '/error',
        component: () => import('../views/ErrorView.vue'),
        meta: {
            access: RouteAccess.Public,
        }
    },
    {
        path: '/schedule',
        component: () => import('../views/ScheduleView.vue'),
        meta: {
            access: RouteAccess.Private,
        }
    }
];

export default routes;