<template>
  <!-- FIXME change to state == logged-in-->
  <nav class="navbar navbar-light bg-light ps-0 navbar-expand-sm" style="height: 3rem;"
       v-if="$router.currentRoute.value.path !== '/login'">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" aria-label="Home">
        <NacsosLogo style="height: 4rem; width: 4rem" class="mt-4"/>
      </a>
      <!-- burger menu button, which will appear on narrow screens -->
      <!-- TODO make the burger menu actually work-->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
               data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fad fa-user-circle me-1" style="font-size: 1.5em; vertical-align: middle;"></i>Username
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

import NacsosLogo from '@/components/NacsosLogo.vue';

export default {
  name: 'NavBar',
  components: { NacsosLogo },
};
</script>

<style scoped>
nav {
  border-bottom: 1px solid gray;
}
</style>
