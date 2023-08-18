<template>
  <div>
    <div v-if="projectPermissions.dataset_read">
      <router-view />
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { currentProjectStore } from '@/stores';
import type { ProjectPermissionsModel } from '@/plugins/api/api-core';

export default defineComponent({
  name: 'DatasetContainer',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissionsModel,
    };
  },
});
</script>

<style scoped>

</style>
