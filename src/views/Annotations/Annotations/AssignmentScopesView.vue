<template>
  <div>
    <h2>List of Assignments</h2>
    <ul v-if="annotationScopes.length > 0">
      <li v-for="scope in annotationScopes" :key="scope.scope.assignment_scope_id">
        {{ scope.scheme_name }}
        <em>({{ scope.scope.name }})</em>&nbsp;
        <router-link
          :to="{ name: 'project-annotate-item', params: { scope_id: scope.scope.assignment_scope_id } }"
          class="link-secondary">
          <font-awesome-icon :icon="['fas', 'tags']" />
        </router-link>
        <br />
        Assignments:
        <InlineToolTip info="Completed assignments">{{ scope.num_completed }}</InlineToolTip>
        /
        <InlineToolTip info="Partially completed assignments">{{ scope.num_partial }}</InlineToolTip>
        /
        <InlineToolTip info="Number of assignments"><strong>{{ scope.num_assignments }}</strong></InlineToolTip>
        ({{ ((scope.num_completed / scope.num_assignments) * 100).toFixed(0) }}%)
      </li>
    </ul>
    <div v-else>
      Loading assignments (or you have none)...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { currentProjectStore } from '@/stores';
import InlineToolTip from '@/components/InlineToolTip.vue';
import type { UserProjectAssignmentScope } from '@/plugins/api/api-core';
import { API, ignore } from '@/plugins/api';

export default defineComponent({
  name: 'AssignmentScopesView',
  components: { InlineToolTip },
  data() {
    return {
      annotationScopes: [] as UserProjectAssignmentScope[],
    };
  },
  async mounted() {
    API.core.annotations.getAssignmentScopesForUserApiAnnotationsAnnotateScopesProjectIdGet({
      projectId: currentProjectStore.projectId as string,
      xProjectId: currentProjectStore.projectId as string,
    })
      .then((response) => { this.annotationScopes = response.data; })
      .catch(ignore);
  },
  methods: {
    // none
  },
});
</script>

<style scoped>

</style>
