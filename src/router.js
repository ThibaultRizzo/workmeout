import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";

import Login from "@/components/Login";
import Register from "@/components/Register";
import Workouts from "@/components/Workouts";
import WorkoutPlayer from "@/components/WorkoutPlayer";

Vue.use(Router);
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "*", redirect: "/workouts" },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/workouts",
      name: "Workouts",
      component: Workouts,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/play/:id",
      name: "Workout Player",
      component: WorkoutPlayer,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
