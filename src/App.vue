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

<style lang="scss" scoped>
#app {
  font-family: $typo_body, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  padding: 5vh 5vw;
}

main {
  margin: 5vh 0;
}

@media screen and (max-width: 600px) {
  main {
    margin: 5vh 0vh;
  }
}
</style>
