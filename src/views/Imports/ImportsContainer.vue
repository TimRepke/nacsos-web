<template>
  <div>
    <div v-if="projectPermissions.dataset_edit">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { currentProjectStore } from "@/stores";
import type { ProjectPermissionsModel } from "@/plugins/api/types";

defineOptions({ name: "ImportsContainer" });

const projectPermissions = ref(currentProjectStore.permissions as ProjectPermissionsModel);
</script>

<style scoped></style>
