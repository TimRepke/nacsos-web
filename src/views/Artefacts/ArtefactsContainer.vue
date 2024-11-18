<template>
  <div>
    <div v-if="projectPermissions.artefacts_read">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import type { ProjectPermissionsModel } from "@/plugins/api/types";

export default defineComponent({
  name: "ArtefactsContainer",
  data() {
    return {
      projectPermissions: currentProjectStore.permissions as ProjectPermissionsModel,
    };
  },
});
</script>

<style scoped></style>
