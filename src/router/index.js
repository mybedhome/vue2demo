import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    meta: { keepAlive: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/relation",
    name: "relation",
    component: () => import("../views/relation/RelationView.vue"),
    children: [
      {
        path: "/relationList",
        name: "RelationList",
        component: () => import("../views/relation/RelationList.vue"),
      },
      {
        path: "detail/:id",
        name: "RelationDetail",
        component: () => import("../views/relation/RelationDetail.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
