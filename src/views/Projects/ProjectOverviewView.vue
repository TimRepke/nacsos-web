<template>
  <div class="text-start ps-5">
    <h1>Project Dashboard</h1>
    <h3>{{ project.name }}</h3>
    <div v-html="markdownToHtml(project.description)"></div>
    <pre>
      {{ permissions }}
    </pre>
  </div>
</template>

<script lang="ts">
import { Project, ProjectPermissions } from '@/types/project.d';
import { currentProjectStore } from '@/stores';
import { marked } from 'marked';

export default {
  name: 'ProjectOverviewView',
  setup() {
    return {
      project: currentProjectStore.project as Project,
      permissions: currentProjectStore.projectPermissions as ProjectPermissions,
    };
  },
  methods: {
    markdownToHtml(txt: string) {
      return marked(txt);
    },
  },
};
</script>

<style scoped>

</style>
