import Vue from "vue";
import Vuex from "vuex";
import fb from "./firebaseConfig";

Vue.use(Vuex);

const types = {
  FETCH_REQUEST: "FETCH_REQUEST",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
};

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: {},
    },
    workouts: {
      data: [],
      isLoading: false,
      isLoaded: false,
      error: null,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    workouts(state) {
      return state.workouts;
    },
    getWorkoutById: (state) => (id) => {
      return state.workouts.data.find((w) => w.id === id);
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
    [types.FETCH_REQUEST](state) {
      state.workouts.isLoading = true;
      state.workouts.isLoaded = false;
    },
    [types.FETCH_SUCCESS](state, value) {
      state.workouts.isLoading = false;
      state.workouts.isLoaded = true;
      state.workouts.data = value;
    },
    [types.FETCH_FAILURE](state, error) {
      state.workouts.isLoading = false;
      state.workouts.isLoaded = false;
      state.workouts.error = error;
    },
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setWorkouts", []);
    },
    fetchWorkoutsIfNeeded({ dispatch, state: { loaded, loading } }) {
      if (!loaded || !loading) {
        dispatch("fetchWorkouts");
      }
    },
    fetchWorkouts({ commit }) {
      commit(types.FETCH_REQUEST);
      fb.workoutsCollection.orderBy("createdOn", "desc").onSnapshot(
        (querySnapshot) =>
          commit(
            types.FETCH_SUCCESS,
            querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          ),
        (err) => commit(types.FETCH_FAILURE, err)
      );
    },
  },
});
