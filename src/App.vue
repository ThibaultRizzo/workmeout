<template>
  <div id="app">
    <Navbar v-if="user.data"></Navbar>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "@/components/Navbar";

export default {
  name: "App",
  components: { Navbar },
  computed: {
    ...mapGetters({ user: "user" })
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
}

main {
  height: 70vh;
  margin: 5vh 10vh;
}
</style>
