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
  history: createWebHistory(
    // 깃허브 페이지에서는 /mathematica/로 배포
    import.meta.env.PROD ? "/mathematica/" : "/"
  ),
  routes,
});

export default router;
