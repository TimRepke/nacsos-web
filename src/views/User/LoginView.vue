<template>
  <div class="wrapper p-0 m-0 overflow-auto h-100 w-100 container-fluid d-flex justify-content-center flex-wrap">
    <div class="flex-row mt-2 mt-sm-5 w-100">
      <NacsosLogo style="height: 200px; width: 200px" class="p-0" />
    </div>
    <div class="flex-row w-100">
      <div class="bg-body bg-opacity-75 rounded p-5 col-lg-4 col-md-6 col-sm-8 col-12 mt-2 mt-sm-5 m-auto">
        <form @submit.prevent>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="usernameInput" placeholder="Username" v-model="username" />
            <label for="usernameInput">Username</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="passwordInput" placeholder="Password" v-model="password" />
            <label for="passwordInput">Password</label>
          </div>
          <div class="alert alert-danger d-flex align-items-center" :class="{ 'd-none': !error }" role="alert">
            <font-awesome-icon
              :icon="['fas', 'triangle-exclamation']"
              class="flex-shrink-0 me-2"
              style="font-size: 1.5em; vertical-align: middle"
            />
            <div class="text-start ms-3">Computer says no. <br />Please double-check username and password.</div>
          </div>
          <button type="submit" class="btn btn-outline-dark w-100" @click="login">LOGIN</button>
        </form>
      </div>
    </div>

    <div class="imprint">
      <router-link :to="{ name: 'about' }">Imprint/Legal/Cookies</router-link>
    </div>

    <div class="license">
      Picture:
      <a href="https://creativecommons.org/licenses/by/3.0" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>
      (
      <a href="https://commons.wikimedia.org/wiki/File:Portara_Naxos_26.jpg" target="_blank" rel="noopener noreferrer"
        >Olaf Tausch</a
      >)
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NacsosLogo from "@/components/NacsosLogo.vue";
import { EventBus } from "@/plugins/events";
import { AuthFailedEvent, UserLoginEvent, LoginSuccessEvent } from "@/plugins/events/events/auth";

export default defineComponent({
  name: "LoginView",
  components: { NacsosLogo },
  data() {
    return {
      username: "",
      password: "",
      error: false,
    };
  },
  mounted() {
    EventBus.on(AuthFailedEvent, () => {
      this.error = true;
    });
  },
  methods: {
    async login() {
      this.error = false;
      EventBus.emit(new UserLoginEvent(this.username, this.password));
      EventBus.once(LoginSuccessEvent, () => {
        this.$router.push({ name: "project-list" });
      });
    },
  },
});
</script>

<style scoped>
input {
  --bs-bg-opacity: 0.9;
}

.wrapper {
  background-image: url("@/assets/img/Portara_Naxos_26.jpg");
  /*
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.license {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #ffffff73;
  padding: 0.25rem;
  font-size: 0.7rem;
}
.imprint {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: #ffffff73;
  padding: 0.25rem;
  font-size: 0.7rem;
}
</style>
