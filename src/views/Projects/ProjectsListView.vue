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
import { callProjectsListEndpoint } from '@/plugins/api/projects';
import { Project } from '@/types/project.d';
import { currentProjectStore } from '@/stores';
import { CurrentProjectSetEvent } from '@/plugins/events/events/projects';

export default {
  name: 'ProjectListView',
  created() {
    this.$eventBus.once(CurrentProjectSetEvent, () => {
      this.$router.push('/project/overview');
    });
  },
  async setup() {
    const projectList: Project[] | undefined = (await callProjectsListEndpoint()).payload;
    return {
      projectList,
    };
  },
  methods: {
    selectProject(projectId: string) {
      console.log(projectId);
      currentProjectStore.projectId = projectId;
      currentProjectStore.setProject(projectId);
    },
  },
};
</script>

<style scoped>

</style>
