<script setup lang="ts">
import { currentProjectStore } from "@/stores";
</script>

<template>
  <div>
    <div v-if="currentProjectStore.permissions.annotations_prio">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<style scoped></style>
