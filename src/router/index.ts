import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routes from "@/router/routes";
import {isAuthorized} from "@/utils";
import {RouteAccess} from "@/router/types";

import 'vue-router'
import {ApiService} from "@/api/services";

declare module 'vue-router' {
  interface RouteMeta {
    access: RouteAccess,
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.access === RouteAccess.Private)) {
    if (isAuthorized()) {
      next();
    } else {
      next("/login");
    }
  } else if (to.matched.some((record) => record.meta.access === RouteAccess.PrivateWhileAuthorized) && isAuthorized()) {
    next("/");
  } else {
    next();
  }
});

export default router;
