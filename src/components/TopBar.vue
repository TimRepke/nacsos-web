<template>
  <nav class="navbar navbar-light bg-light ps-0 p-0 p-sm-1 navbar-expand-sm sticky-sm-top">
    <div class="container-fluid">
      <!--      <router-link to="/" class="navbar-brand">-->
      <!--        <NacsosLogo style="height: 4rem; width: 4rem" class="mt-0 mt-sm-4"/>-->
      <!--      </router-link>-->
      <!-- burger menu button, which will appear on narrow screens -->
      <!-- TODO make the burger menu actually work-->
      <button
        type="button"
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse justify-content-end bg-light" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/project-list" class="nav-link">Projects</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              role="button"
              id="navbarDropdownMenuLink"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              href="#">
              <font-awesome-icon
                class="me-1 mb-1"
                style="font-size: 1.5em; vertical-align: middle;"
                :icon="['fas', 'circle-user']" />
              {{ user?.username || 'Username' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
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
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">

import { UserModel } from '@/plugins/api/api-core';
import { currentUserStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { LoggedOutEvent } from '@/plugins/events/events/auth';

export default {
  name: 'TopBar',
  computed: {
    user(): UserModel {
      return currentUserStore.user;
    },
  },
  methods: {
    logout() {
      this.$router.push({ name: 'user-login' });
      EventBus.emit(new LoggedOutEvent());
    },
  },
};
</script>

<style scoped>
nav {
  border-bottom: 1px solid gray;
  height: 3rem;
}
</style>
