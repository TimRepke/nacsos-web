<template>
  <div>
    <div v-if="projectPermissions.annotations_edit">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import type { ProjectPermissionsModel } from "@/plugins/api/spec/types.gen";

export default defineComponent({
  name: "AnnotationConfigsContainer",
  data() {
    return {
      projectPermissions: currentProjectStore.permissions as ProjectPermissionsModel,
    };
  },
});
</script>

<style scoped></style>
