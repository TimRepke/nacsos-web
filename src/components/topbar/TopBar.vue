<script setup lang="ts">
import TokenNotice from "@/components/topbar/TokenNotice.vue";
import UserMenu from "@/components/topbar/UserMenu.vue";
import HighlighterMenu from "@/components/topbar/HighlighterMenu.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<template>
  <div class="border-bottom bg-light justify-content-end fs-6 align-items-center text-muted">
    <TokenNotice />

    <div class="pe-4">
      <router-link to="/project-list" class="nav-link">Projects</router-link>
    </div>
    <div class="pe-4">
      <router-link to="/about" class="nav-link">About</router-link>
    </div>
    <div class="pe-4">
      <a href="https://apsis.mcc-berlin.net/nacsos-docs/" class="nav-link fw-bold" target="_blank">
        <font-awesome-icon :icon="['far', 'circle-question']" />
        Help
      </a>
    </div>

    <div class="vr me-4"></div>

    <HighlighterMenu class="pe-4" />

    <UserMenu class="pe-4" />
  </div>
</template>

<style scoped>
nav {
  border-bottom: 1px solid gray;
  height: 3rem;
}
</style>
