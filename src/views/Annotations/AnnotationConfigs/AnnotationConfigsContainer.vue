<template>
  <div>
    <div v-if="projectPermissions.annotations_edit">
      <router-view></router-view>
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';

export default {
  name: 'AnnotationConfigsContainer',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions,
    };
  },
};
</script>

<style scoped>

</style>
