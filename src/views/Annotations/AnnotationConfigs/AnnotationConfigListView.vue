<template>
  <div class="text-start">
    <h1>Annotation Tasks and Assignment Scopes</h1>
    <!-- TODO make pretty -->
    <ul>
      <li v-for="task in projectTasks" :key="task.annotation_task_id">
        {{ task.name }}
        <router-link :to="{ name:'config-annotation-task-edit', params: { task_id: task.annotation_task_id } }"
                     class="link-secondary me-1">
          <font-awesome-icon :icon="['fas', 'pen']"/>
        </router-link>
        <a @click="remove(task)" tabindex="0" aria-label="Delete task" class="link-secondary me-1" role="button">
          <font-awesome-icon :icon="['fas', 'trash-can']"/>
        </a>
        <ul>
          <li v-for="scope in (scopesLookup[task.annotation_task_id] || [])"
              :key="scope.assignment_scope_id">
            {{ scope.name }}
          </li>
        </ul>
        <button class="btn btn-outline-secondary mb-2" @click="createAnnotationScope()">Create Scope</button>
      </li>
    </ul>
    <div v-for="s in projectScopes" :key="s.assignment_scope_id">{{ s.name }}</div>
    <button class="btn btn-outline-primary mb-2" @click="createNewTask()">Add New Task</button>
  </div>
</template>

<script lang="ts">
import { callProjectScopesEndpoint, callProjectTasksEndpoint } from '@/plugins/api/annotations';
import { AnnotationTask, AssignmentScope } from '@/types/annotation.d';
import { currentProjectStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';

export default {
  name: 'AnnotationConfigListView',
  async setup() {
    const projectTasks: AnnotationTask[] = (await callProjectTasksEndpoint(
      { projectId: currentProjectStore.project!.project_id! },
    )).payload as AnnotationTask[];
    const projectScopes: AssignmentScope[] = (await callProjectScopesEndpoint()).payload as AssignmentScope[];
    return {
      projectTasks,
      projectScopes,
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
    remove(task: AnnotationTask) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following annotation task?\n'
        + `- "${task.name}"\n`
        + `- ID: ${task.annotation_task_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (response) => {
          if (response === 'ACCEPT') {
            // TODO implement annotation task deletion
          }
        },
        'Delete annotation task',
      ));
    },
  },
  computed: {
    scopesLookup(): { [key: string]: AssignmentScope[] } {
      return this.projectScopes.reduce((ret: { [key: string]: AssignmentScope[] }, scope: AssignmentScope) => {
        if (!(scope.task_id in ret)) {
          // eslint-disable-next-line no-param-reassign
          ret[scope.task_id] = [];
        }
        ret[scope.task_id].push(scope);
        return ret;
      }, {});
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
