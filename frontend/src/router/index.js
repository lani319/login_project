import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import RegistView from "../views/RegistView.vue";
import MypageView from "../views/MypageView.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: LoginView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/logout",
    name: "logout",
    component: LogoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage",
    name: "mypage",
    component: MypageView,
    meta: { requiresAuth: true },
  },
  {
    path: "/regist",
    name: "regist",
    component: RegistView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLogin = store.state.isLogin;
  //console.log("islogin", isLogin);

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLogin) {
    // to.matched는 이동할 route와 match되는 route들
    next("/login"); // redirect to homepage
  } else {
    next(); // direct to to
  }
});

export default router;
