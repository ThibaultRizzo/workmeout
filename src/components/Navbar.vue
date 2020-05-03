<template>
  <header>
    <div id="logo-container">
      <router-link to="dashboard">
        <img id="logo" alt="Logo" src="../assets/WorkMeOut_Logo.svg" />
      </router-link>
    </div>
    <h3 class="title">WorkMeOut</h3>
    <nav>
      <router-link to="dashboard">Dashboard</router-link>
      <router-link to="workout-player">Workout</router-link>
      <a @click="logout">
        <Logout />
      </a>
    </nav>
  </header>
</template>
<script>
import fb from "../firebaseConfig";
import Logout from "vue-material-design-icons/LogoutVariant.vue";
export default {
  components: {
    Logout
  },
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => console.error(err));
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  height: 20vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 12px 2px #efefef;
}
nav {
  display: flex;
  align-items: center;
}
#logo-container {
  height: 100%;
  padding: 0 10px;
}
#logo {
  height: 80%;
  width: auto;
  padding: 10%;
}

.title {
  font-size: 2em;
}
a {
  padding: 10px;
}
</style>