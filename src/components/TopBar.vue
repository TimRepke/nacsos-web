<template>
  <nav class="navbar navbar-light bg-light ps-0 p-0 p-sm-1 navbar-expand-sm sticky-sm-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <NacsosLogo style="height: 4rem; width: 4rem" class="mt-0 mt-sm-4"/>
      </router-link>
      <!-- burger menu button, which will appear on narrow screens -->
      <!-- TODO make the burger menu actually work-->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"
              style="margin-top: -1.5rem;">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end bg-light" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <!--li class="nav-item">
            <router-link to="/projects" class="nav-link">Projects</router-link>
          </li-->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
               data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon :icon="['fas', 'circle-user']"
                                 class="me-1 mb-1" style="font-size: 1.5em; vertical-align: middle;"/>
              {{ user?.username || 'Username' }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li><a class="dropdown-item" href="#">Edit Profile</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" @click="logout">Log out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import NacsosLogo from '@/components/NacsosLogo.vue';
import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { storeToRefs } from 'pinia';

export default {
  name: 'TopBar',
  components: { NacsosLogo },
  setup() {
    const store = useCurrentUserStore();
    const { user } = storeToRefs(store);
    const { logout } = store;
    return {
      user,
      logout,
    };
  },
};
</script>

<style scoped>
nav {
  border-bottom: 1px solid gray;
  height: 3rem;
}
</style>
