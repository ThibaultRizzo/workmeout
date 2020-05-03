import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: {},
    },
    workouts: {
      data: [],
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    workouts(state) {
      return state.workouts;
    },
  },
  mutations: {
    setCurrentUser(state, value) {
      state.user.data = value;
      state.user.loggedIn = !value;
    },
    setWorkouts(state, value) {
      state.workouts.data = value;
    },
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setWorkouts", []);
    },
  },
});
