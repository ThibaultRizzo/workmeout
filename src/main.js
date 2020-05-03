import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import fb from "./firebaseConfig";

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV === "development";
let app;
fb.auth.onAuthStateChanged((user) => {
  store.commit("setCurrentUser", user);

  fb.workoutsCollection
    .orderBy("createdOn", "desc")
    .onSnapshot((querySnapshot) => {
      store.commit(
        "setWorkouts",
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: (h) => h(App),
    });
  }
});
