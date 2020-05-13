<template>
  <header>
    <div id="logo-container">
      <router-link to="workouts"></router-link>
      <img id="logo" alt="Logo" src="../assets/logo.svg" />
    </div>
    <h1 id="navbar__title">Work Me Out</h1>
    <!-- <nav>
      <a @click="logout">
        <Logout />
      </a>
    </nav>-->
  </header>
</template>
<script>
import fb from "../firebaseConfig";
// import Logout from "vue-material-design-icons/LogoutVariant.vue";
export default {
  components: {
    // Logout
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
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border-bottom: 4px solid $accent;
}
nav {
  display: flex;
  align-items: center;
}
#logo-container {
  position: absolute;
  left: 0;
  box-sizing: content-box;
  height: 1.5 * $HEADER_SIZE;
  padding-top: $HEADER_SIZE;
  background-color: $white;
  a {
    padding: 0;
  }
}
#logo {
  height: 100%;
  width: auto;
}

#navbar__title {
  font-family: $typo_title;
  font-size: 3.5em;
}
a {
  padding: 10px;
}

@media screen and (max-width: 600px) {
  header {
    height: 18vh;
    padding-top: 5vh;
    flex-flow: column wrap;
    justify-content: center;
    align-items: flex-start;
    #logo-container {
      padding-top: 1vh;
      padding-left: 4vh;
      height: 18.5vh;
    }
    h3.title {
      font-size: 2.2em;
    }
  }
}
</style>