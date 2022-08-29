<template>
  <div>
    <ul class="text-start">
      <li v-for="project in projectList" :key="project.project_id">
        <a @click="selectProject(project.project_id)" role="button" tabindex="0"> {{ project.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { EventBus } from '@/plugins/events';
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from '@/plugins/events/events/projects';
import { ProjectModel } from '@/plugins/api/api-core';
import { coreAPI } from '@/plugins/api';

export default {
  name: 'ProjectListView',
  data() {
    return {
      projectList: [] as ProjectModel[],
    };
  },
  async mounted() {
    // clear the currentProjectStore to prevent side effects
    // currentProjectStore.clear();
    // get all projects from the server (that we have permission to access)
    const projects = await coreAPI.projects.getAllProjectsApiProjectsListGet();
    if (projects) this.projectList = projects;
  },
  methods: {
    selectProject(projectId: string) {
      console.log(projectId);
      EventBus.emit(new CurrentProjectSelectedEvent(projectId));
      EventBus.once(CurrentProjectSetEvent, () => {
        this.$router.push({ name: 'project-overview' });
      });
    },
  },
};
</script>

<style scoped>

</style>
