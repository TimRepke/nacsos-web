<template>
  <div>
    <div class="text-start ps-5" v-if="project && permissions">
      <h1>Project Dashboard</h1>
      <h3>{{ project.name }}</h3>
      <div v-html="markdownToHtml(project.description)" />
      <pre>
        {{ permissions }}
      </pre>
    </div>
    <div v-else>
      Something failed, please try reloading the page (or go back to project seletion page and choose the project
      again).
    </div>
  </div>
</template>

<script lang="ts">
import { ProjectModel, ProjectPermissionsModel } from '@/plugins/api/api-core';
import { currentProjectStore } from '@/stores';
import { marked } from 'marked';

type ProjectOverview = {
  project?: ProjectModel;
  permissions?: ProjectPermissionsModel;
};

export default {
  name: 'ProjectOverviewView',
  data(): ProjectOverview {
    return {
      project: undefined,
      permissions: undefined,
    };
  },
  mounted() {
    this.project = currentProjectStore.project;
    this.permissions = currentProjectStore.projectPermissions;
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
