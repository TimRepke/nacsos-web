<template>
  <div v-if="projectPermissions.annotations_edit">
    <router-view></router-view>
  </div>
  <div v-else>
    Unfortunately, you don't have permission to access this page.
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';

export default {
  name: 'AnnotationConfigsView',
  data() {
    return {
      projectPermissions: currentProjectStore.projectPermissions,
    };
  },
};
</script>

<style scoped>

</style>
