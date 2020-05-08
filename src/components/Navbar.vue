<template>
  <header>
    <div id="logo-container">
      <router-link to="dashboard"></router-link>
      <img id="logo" alt="Logo" src="../assets/WorkMeOut_Logo.svg" />
    </div>
    <h3 class="title">Work Me Out</h3>
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
$HEADER_SIZE: 15vh;
header {
  height: $HEADER_SIZE;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #efefef;
}
nav {
  display: flex;
  align-items: center;
}
#logo-container {
  box-sizing: content-box;
  height: 1.5 * $HEADER_SIZE;
  padding-top: $HEADER_SIZE;
  padding-left: $HEADER_SIZE / 2;
  background-color: #fafafa;
  a {
    padding: 0;
  }
}
#logo {
  height: 100%;
  width: auto;
}

.title {
  font-size: 2em;
}
a {
  padding: 10px;
}
</style>