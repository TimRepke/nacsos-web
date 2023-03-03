<template>
  <div class="border-bottom bg-light justify-content-end fs-6 align-items-center text-muted">
    <div class="pe-4">
      <router-link to="/project-list" class="nav-link">Projects</router-link>
    </div>
    <div class="pe-4">
      <router-link to="/about" class="nav-link">About</router-link>
    </div>
    <div class="dropdown pe-4">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <font-awesome-icon
          class="me-1 mb-1"
          style="font-size: 1.5em; vertical-align: middle;"
          :icon="['fas', 'circle-user']" />
        {{ user?.username || 'Username' }}
      </a>
      <ul class="dropdown-menu">
        <template v-if="user.is_superuser">
          <li>
            <h6 class="dropdown-header">
              <font-awesome-icon :icon="['fas', 'toolbox']" class="me-2" />
              Admin Area
            </h6>
          </li>
          <li>
            <router-link
              to="/admin/projects"
              class="dropdown-item">
              Manage projects
            </router-link>
          </li>
          <li>
            <router-link
              to="/admin/users"
              class="dropdown-item">
              Manage users
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider">
          </li>
        </template>
        <li>
          <router-link
            to="/user/profile"
            class="dropdown-item">
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

import type { UserModel } from '@/plugins/api/api-core';
import { currentUserStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { LoggedOutEvent, LogoutSuccessEvent } from '@/plugins/events/events/auth';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TopBar',
  computed: {
    user(): UserModel {
      return currentUserStore.user as UserModel;
    },
  },
  methods: {
    logout() {
      EventBus.emit(new LoggedOutEvent());
      EventBus.once(LogoutSuccessEvent, () => {
        console.log('loe');
        this.$router.push({ name: 'user-login' });
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
