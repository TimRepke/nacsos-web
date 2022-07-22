<template>
  <div>
    <div v-if="projectPermissions.dataset_read">
      <router-view></router-view>
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import { ProjectPermissions } from '@/types/project.d';

export default {
  name: 'DatasetContainer',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissions,
    };
  },
};
</script>

<style scoped>

</style>
