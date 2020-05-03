<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div>
        <h1>WorkmeOut App</h1>
        <p>App Presentation....</p>
      </div>
      <div>
        <form v-if="showLoginForm" @submit="login" @submit.prevent>
          <h1>Welcome Back</h1>

          <label for="email1">Email</label>
          <input
            id="email1"
            name="email"
            type="email"
            placeholder="you@email.com"
            class="form-control"
            value
            required
            autofocus
            v-model.trim="loginForm.email"
          />

          <label for="password1">Password</label>
          <input
            id="password1"
            type="password"
            placeholder="*****"
            class="form-control"
            name="password"
            required
            v-model.trim="loginForm.password"
          />

          <button type="submit" class="button">Log In</button>

          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
            <a @click="toggleForm">Create an Account</a>
          </div>
        </form>

        <form v-else @submit="signup" @submit.prevent>
          <h1>Get Started</h1>

          <label for="name">Name</label>
          <input v-model.trim="signupForm.name" type="text" placeholder="Workmeout" id="name" />

          <label for="email2">Email</label>
          <input v-model.trim="signupForm.email" type="email" placeholder="Workmeout" id="name" />

          <label for="password2">Password</label>
          <input v-model.trim="signupForm.password" type="text" placeholder="Workmeout" id="name" />

          <button type="submit" class="button">Sign Up</button>

          <div class="extras">
            <a @click="toggleForm">Back to Log In</a>
          </div>
        </form>

        <form v-if="showForgotPassword" @submit="resetPassword" @submit.prevent>
          <div v-if="passwordResetSuccess">
            <h1>Email Sent</h1>
            <p>Check your email for a link to reset your password</p>
            <button @click="togglePasswordReset" class="button">Back to Login</button>
          </div>
          <div v-else>
            <h1>Reset Password</h1>
            <p>We will send you an emial to reset your password</p>

            <label for="email3">Email</label>
            <input v-model.trim="passwordResetForm.email" type="email" name="email" id="email3" />

            <button type="submit" class="button">Submit</button>

            <div class="extras">
              <a @click="togglePasswordReset">Back to Log In</a>
            </div>
          </div>
        </form>

        <transition name="fade">
          <div v-if="error !== ''" class="error-msg">
            <p>{{ error }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import fb from "../firebaseConfig";

export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        email: "",
        password: ""
      },
      passwordResetForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      passwordResetSuccess: false,
      performingRequest: false,
      error: ""
    };
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
      this.error = "";
    },
    togglePasswordReset() {
      this.showForgotPassword = !this.showForgotPassword;
    },
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(({ user }) => {
          this.$store.commit("setCurrentUser", user);
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.error = err.message;
          console.error(err);
        })
        .finally(() => {
          this.performingRequest = false;
        });
    },
    resetPassword() {
      this.performingRequest = true;

      fb.auth
        .sendPasswordResetEmail(this.passwordResetForm.email)
        .then(() => {
          this.passwordResetSuccess = true;
          this.passwordResetForm.email = "";
        })
        .catch(err => {
          this.error = err.message;
          console.error(err);
        })
        .finally(() => {
          this.performingRequest = false;
        });
    },
    signup() {
      this.performingRequest = true;

      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(() => {
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.error = err.message;
          console.error(err);
        })
        .finally(() => {
          this.performingRequest = false;
        });
    }
  }
};
</script>