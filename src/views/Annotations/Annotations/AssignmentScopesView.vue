<template>
  <div class="text-start p-2">
    <h1>List of Assignments</h1>
    <ul>
      <li v-for="scope in annotationScopes" :key="scope.scope.assignment_scope_id">
        <router-link :to="{ name:'project-annotate-item', params: { scope_id: scope.scope.assignment_scope_id } }">
          {{ scope.scope.name }}
        </router-link> |
        Assignments:
        <InlineToolTip info="Completed assignments">{{ scope.num_completed }}</InlineToolTip> /
        <InlineToolTip info="Partially completed assignments">{{ scope.num_partial }}</InlineToolTip> /
        <InlineToolTip info="Number of assignments">{{ scope.num_assignments }}</InlineToolTip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { callProjectUserScopesEndpoint } from '@/plugins/api/annotations';
import { currentProjectStore } from '@/stores';
import InlineToolTip from '@/components/InlineToolTip.vue';

export default {
  name: 'AssignmentScopesView',
  components: { InlineToolTip },
  async setup() {
    const currentProjectId = currentProjectStore.projectId!;
    const response = await callProjectUserScopesEndpoint({ projectId: currentProjectId });
    return {
      annotationScopes: response.payload,
    };
  },
  methods: {
    // none
  },
};
</script>

<style scoped>

</style>
