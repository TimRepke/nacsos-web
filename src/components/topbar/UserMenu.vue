<script setup lang="ts">
import { EventBus } from "@/plugins/events";
import { LoggedOutEvent, LogoutSuccessEvent } from "@/plugins/events/events/auth";
import { currentUserStore } from "@/stores";

function logout() {
  EventBus.emit(new LoggedOutEvent());
  EventBus.once(LogoutSuccessEvent, () => {
    this.$router.push({ name: "user-login" });
  });
}
</script>

<template>
  <div class="dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      <font-awesome-icon
        class="me-1 mb-1"
        style="font-size: 1.5em; vertical-align: middle"
        :icon="['fas', 'circle-user']"
      />
      {{ currentUserStore.user?.username || "Username" }}
    </a>
    <ul class="dropdown-menu">
      <template v-if="currentUserStore.user?.is_superuser">
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
        <router-link to="/nql" class="dropdown-item">
          <font-awesome-icon :icon="['fas', 'feather']" class="me-2" />
          NQL toolkit
        </router-link>
      </li>
      <li>
        <router-link to="/user/profile" class="dropdown-item">
          <font-awesome-icon :icon="['fas', 'user-pen']" class="me-2" />
          Edit Profile
        </router-link>
      </li>
      <li class="dropdown-item" role="button" @click="logout">
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="me-2" />
        Log out
      </li>
    </ul>
  </div>
</template>
