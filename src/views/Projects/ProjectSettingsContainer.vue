<template>
  <div>
    <div v-if="projectPermissions.owner">
      <router-view />
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import { ProjectPermissionsModel } from '@/plugins/api/api-core';

export default {
  name: 'ProjectSettingsContainer',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissionsModel,
    };
  },
};
</script>

<style scoped>

</style>
