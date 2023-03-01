import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/SortAnimation/SortPanel.vue"),
    },
    {
      path: "/algorithm/sort",
      name: "sort",
      component: () => import("../views/SortAnimation/SortPanel.vue"),
    },
  ],
});

export default router;
