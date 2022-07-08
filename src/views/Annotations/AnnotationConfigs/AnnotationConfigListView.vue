<template>
  <div class="text-start">
    <h1>Annotation Tasks and Scopes</h1>
    <!-- TODO make pretty -->
    <ul>
      <li v-for="task in projectTasks" :key="task.annotation_task_id">
        <router-link :to="{ name:'config-annotation-task-edit', params: { task_id: task.annotation_task_id } }">
          {{ task.name }}
        </router-link>
        <button class="btn btn-outline-secondary mb-2" @click="createAnnotationScope()">Create Scope</button>
      </li>
    </ul>
    <button class="btn btn-outline-primary mb-2" @click="createNewTask()">Add New Task</button>
  </div>
</template>

<script lang="ts">
import { callProjectTasksEndpoint } from '@/plugins/api/annotations';
import { AnnotationTask } from '@/types/annotation.d';
import { currentProjectStore } from '@/stores';

export default {
  name: 'AnnotationConfigListView',
  async setup() {
    const response = await callProjectTasksEndpoint({ projectId: currentProjectStore.project!.project_id! });
    return {
      projectTasks: response.payload as AnnotationTask[],
    };
  },
  methods: {
    createNewTask() {
      // TODO create new task in db
      // TODO push new task id to router
    },
    createAnnotationScope() {
      // TODO
    },
  },
};
</script>

<style scoped>
.annotation-sidebar {
  height: var(--body-height);
  overflow-x: hidden;
  overflow-y: auto;
  border: none;
}

@media (min-width: 992px) {
  /*
  FIXME is it possible to import var from bootstrap?
        ideally by overriding border-start.
  */
  .annotation-sidebar {
    border-left: 1px solid #dee2e6 !important;
  }
}
</style>
