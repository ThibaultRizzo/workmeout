<template>
  <header>
    <section>
      <router-link to="dashboard">
        <h3>Workmeout</h3>
      </router-link>
      <nav>
        <router-link to="dashboard">Dashboard</router-link>
        <router-link to="workout-player">Workout</router-link>
        <a @click="logout">Logout</a>
      </nav>
    </section>
  </header>
</template>
<script>
import fb from "../firebaseConfig";
export default {
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