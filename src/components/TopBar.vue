<template>
  <div class="border-bottom bg-light justify-content-end fs-6 align-items-center text-muted">
    <div class="pe-4 text-warning" v-if="authTokenIsInvalidSoon">
      <span> Your auth token is running out soon! </span>
      <router-link :to="{ name: 'user-profile' }" class="nav-link d-inline-block">
        <font-awesome-icon
          class="me-1 mb-1"
          style="font-size: 1.5em; vertical-align: middle"
          :icon="['fas', 'toilet-paper-slash']"
        />
        Replenish!
      </router-link>
    </div>
    <div class="pe-4">
      <router-link to="/project-list" class="nav-link">Projects</router-link>
    </div>
    <div class="pe-4">
      <router-link to="/about" class="nav-link">About</router-link>
    </div>
    <div class="pe-4">
      <a href="https://apsis.mcc-berlin.net/nacsos-docs/" class="nav-link" target="_blank">Help</a>
    </div>
    <div class="dropdown pe-4">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <font-awesome-icon
          class="me-1 mb-1"
          style="font-size: 1.5em; vertical-align: middle"
          :icon="['fas', 'circle-user']"
        />
        {{ userStore.user?.username || "Username" }}
      </a>
      <ul class="dropdown-menu">
        <template v-if="userStore.user?.is_superuser">
          <li>
            <h6 class="dropdown-header">
              <font-awesome-icon :icon="['fas', 'toolbox']" class="me-2" />
              Admin Area
            </h6>
          </li>
          <li>
            <router-link to="/admin/news" class="dropdown-item">Message users</router-link>
          </li>
          <li>
            <router-link to="/admin/projects" class="dropdown-item">Manage projects</router-link>
          </li>
          <li>
            <router-link to="/admin/users" class="dropdown-item">Manage users</router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link to="/admin/celery" class="dropdown-item">Celery</router-link>
          </li>
          <li>
            <a href="http://10.10.13.45:8085/" class="dropdown-item" target="_blank">Dramatiq Dash</a>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
        </template>
        <li>
          <router-link to="/nql" class="dropdown-item">NQL toolkit</router-link>
        </li>
        <li>
          <router-link to="/user/profile" class="dropdown-item">
            <font-awesome-icon :icon="['fas', 'user-pen']" class="me-2" />
            Edit Profile
          </router-link>
        </li>
        <li class="dropdown-item" type="button" @click="logout">
          <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="me-2" />
          Log out
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentUserStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { LoggedOutEvent, LogoutSuccessEvent } from "@/plugins/events/events/auth";

export default defineComponent({
  name: "TopBar",
  data() {
    return {
      userStore: currentUserStore,
      // this stores the "current time"
      // it's updated every minute and prevents `authTokenIsInvalidSoon` to update every millisecond
      now: Date.now(),
    };
  },
  created() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    // update the current time every minute
    setInterval(() => {
      self.now = Date.now();
    }, 60 * 1000);
  },
  computed: {
    authTokenIsInvalidSoon(): boolean {
      // 24 * 60 * 60 * 1000 = 86400000 (1 day in ms)
      const valid = this.userStore.authToken?.valid_till;
      if (!valid) {
        return false;
      }
      return new Date(valid).getTime() - this.now - 86400000 < 0;
    },
  },
  methods: {
    logout() {
      EventBus.emit(new LoggedOutEvent());
      EventBus.once(LogoutSuccessEvent, () => {
        this.$router.push({ name: "user-login" });
      });
    },
  },
});
</script>

<style scoped>
nav {
  border-bottom: 1px solid gray;
  height: 3rem;
}
</style>
