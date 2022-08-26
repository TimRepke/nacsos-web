<template>
  <div>
    <div v-if="projectPermissions.artefacts_read">
      <router-view />
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import { ProjectPermissionsModel } from '@/plugins/client-core';

export default {
  name: 'ArtefactsContainer',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissionsModel,
    };
  },
};
</script>

<style scoped>

</style>
