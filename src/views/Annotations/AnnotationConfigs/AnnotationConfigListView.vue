<template>
  <div class="text-start">
    <h1>Annotation Tasks and Assignment Scopes</h1>
    <!-- TODO make pretty -->
    <ul>
      <li v-for="task in projectTasks" :key="task.annotation_task_id">
        {{ task.name }}
        <router-link :to="{ name:'config-annotation-task-edit', params: { task_id: task.annotation_task_id } }"
                     class="link-secondary me-1">
          <InlineToolTip info="Edit task"><font-awesome-icon :icon="['fas', 'pen']"/></InlineToolTip>
        </router-link>
        <a @click="copyTask(task)" tabindex="0" aria-label="Copy task" class="link-secondary me-1" role="button">
          <InlineToolTip info="Copy"><font-awesome-icon :icon="['far', 'clone']"/></InlineToolTip>
        </a>
        <a @click="removeTask(task)" tabindex="0" aria-label="Delete task" class="link-secondary me-1" role="button">
          <InlineToolTip info="Delete"><font-awesome-icon :icon="['fas', 'trash-can']"/></InlineToolTip>
        </a>
        <a @click="exportData(task)" tabindex="0" aria-label="Export annotations" class="link-secondary me-1"
           role="button">
          <InlineToolTip info="Export data"><font-awesome-icon :icon="['fas', 'file-export']"/></InlineToolTip>
        </a>
        <ul>
          <li v-for="scope in (scopesLookup[task.annotation_task_id] || [])"
              :key="scope.assignment_scope_id">
            {{ scope.name }}
            <router-link :to="{ name:'config-annotation-task-scope', params: { scope_id: scope.assignment_scope_id } }"
                         class="link-secondary me-1">
              <InlineToolTip info="View and set up assignments"><font-awesome-icon :icon="['fas', 'screwdriver-wrench']"/></InlineToolTip>
            </router-link>
            <a @click="removeScope(scope)" tabindex="0" aria-label="Delete assignment scope" class="link-secondary me-1"
               role="button">
              <InlineToolTip info="Delete"><font-awesome-icon :icon="['fas', 'trash-can']"/></InlineToolTip>
            </a>
          </li>
        </ul>

        <router-link :to="{ name:'config-annotation-task-scope', query: { task_id: task.annotation_task_id } }">
          create
        </router-link>
        <button class="btn btn-outline-secondary m-2" @click="createAnnotationScope()">Create Scope</button>
      </li>
    </ul>
    <button class="btn btn-outline-primary mb-2" @click="createNewTask()">Add New Task</button>
  </div>
</template>

<script lang="ts">
import { callProjectScopesEndpoint, callProjectTasksEndpoint } from '@/plugins/api/annotations';
import { AnnotationTask, AssignmentScope } from '@/types/annotation.d';
import { currentProjectStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import InlineToolTip from '@/components/InlineToolTip.vue';

export default {
  name: 'AnnotationConfigListView',
  components: { InlineToolTip },
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
    copyTask(task: AnnotationTask) {
      // TODO
    },
    exportData(task: AnnotationTask) {
      // TODO
    },
    removeTask(task: AnnotationTask) {
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
    removeScope(scope: AssignmentScope) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following assignment scope?\n'
        + `- "${scope.name}"\n`
        + `- ID: ${scope.assignment_scope_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (response) => {
          if (response === 'ACCEPT') {
            // TODO implement annotation task deletion
          }
        },
        'Delete assignment scope',
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
