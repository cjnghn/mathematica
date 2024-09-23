import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import GaussJordan from "../pages/GaussJordan.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/gauss-jordan",
    name: "GaussJordan",
    component: GaussJordan,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
