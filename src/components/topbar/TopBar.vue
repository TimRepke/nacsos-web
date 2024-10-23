<script setup lang="ts">
import TokenNotice from "@/components/topbar/TokenNotice.vue";
import UserMenu from "@/components/topbar/UserMenu.vue";
import HighlighterMenu from "@/components/topbar/HighlighterMenu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { currentProjectStore } from "@/stores";
import NacsosLogo from "@/components/NacsosLogo.vue";
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <NacsosLogo class="position-absolute top-0" />
      </router-link>
      <button
        class="btn btn-sm ms-auto"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <TokenNotice class="nav-item" />
          <li class="nav-item" v-if="currentProjectStore.projectSelected">
            <router-link to="/project-list" class="nav-link">
              <font-awesome-icon :icon="['fas', 'layer-group']" class="me-1" />
              Projects
            </router-link>
          </li>
          <li class="nav-item">
            <a href="https://apsis.mcc-berlin.net/nacsos-docs/" class="nav-link fw-bold" target="_blank">
              <font-awesome-icon :icon="['far', 'circle-question']" class="me-1" />
              Help
            </a>
          </li>
          <li class="nav-item border-end pe-2 me-2 border-dark-subtle">
            <router-link to="/about" class="nav-link">
              <font-awesome-icon :icon="['fas', 'circle-info']" class="me-1" />
              About
            </router-link>
          </li>

          <HighlighterMenu class="nav-item" v-if="currentProjectStore.projectSelected" />

          <UserMenu class="nav-item" />
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  border-bottom: 1px solid gray;
}
</style>
