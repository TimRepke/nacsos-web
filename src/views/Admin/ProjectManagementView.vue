<template>
  <div>
    <div class="row mb-2 g-0">
      <div class="col-md-3">
        <div class="input-group">
          <span class="input-group-text">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          </span>
          <input
            v-model="projectSearch"
            type="text"
            aria-label="Search"
            placeholder="Search..."
            class="form-control" />
        </div>
      </div>
      <div class="col-auto ms-auto">
        <button type="button" class="btn btn-outline-primary btn-sm mt-2 mb-2" @click="addProject">
          <font-awesome-icon :icon="['far', 'square-plus']" />
          Create project
        </button>
      </div>
    </div>
    <div class="row mb-2 g-0">
      <ul class="list-group">
        <li v-for="project in filteredProjects" :key="project.project_id" class="list-group-item p-4">
          <div class="mb-2">
            <project-type-icon :project-type="project.type" class="me-2" />
            <span class="fs-5">{{ project.name }}</span>
          </div>
          <div v-if="project.isNew" class="mb-2">
            <div class="row">
              <div class="col">
                <input
                  v-model="project.name"
                  type="text"
                  aria-label="Project name"
                  placeholder="Project name"
                  class="form-control" />
              </div>
              <div class="col">
                <select class="form-select" aria-label="Project type" v-model="project.type">
                  <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
              <div class="col">
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="saveProject(project)"
                  :disabled="project.name.length < 10">
                  <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                  Save
                </button>
              </div>
            </div>
          </div>
          <div class="mb-2" v-if="!project.isNew">
            <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="manageUsers(project)">
              <font-awesome-icon :icon="['fas', 'share-from-square']" />
              Edit details and users
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="dropProject(project)">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
              Delete Project
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { API } from '@/plugins/api';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import type { ProjectModel } from '@/plugins/api/api-core';
import { ItemType } from '@/plugins/api/api-core';
import ProjectTypeIcon from '@/components/ProjectTypeIcon.vue';
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from '@/plugins/events/events/projects';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';

type ProjectModelExt = ProjectModel & { isNew?: boolean };

export default defineComponent({
  name: 'ProjectManagementView',
  components: { FontAwesomeIcon, ProjectTypeIcon },
  data() {
    return {
      projectSearch: '',
      projects: [] as ProjectModelExt[],
      projectTypes: ItemType,
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      API.core.projects.getAllProjectsApiProjectsListGet()
        .then((response) => { this.projects = response.data; })
        .catch(() => { EventBus.emit(new ToastEvent('WARN', 'Failed to load list of projects.')); });
    },
    addProject() {
      this.projects.unshift({
        isNew: true,
        name: '',
        description: '',
        type: 'generic',
      } as ProjectModelExt);
    },
    manageUsers(project: ProjectModelExt) {
      if (!project.project_id) {
        EventBus.emit(new ToastEvent('WARN', 'Save first.'));
      } else {
        EventBus.emit(new CurrentProjectSelectedEvent(project.project_id));
        EventBus.once(CurrentProjectSetEvent, () => {
          this.$router.push({ name: 'project-settings-settings' });
        });
      }
    },
    saveProject(project: ProjectModelExt) {
      API.core.projects.createProjectApiProjectsCreatePut({
        requestBody: project,
      }).then((response) => {
        project.project_id = response.data; // eslint-disable-line no-param-reassign
        project.isNew = false; // eslint-disable-line no-param-reassign
        EventBus.emit(new ToastEvent('SUCCESS', `New project created with ID ${project.project_id}`));
      }).catch((reason) => {
        console.error(reason);
        EventBus.emit(new ToastEvent('ERROR', 'Failed to save.'));
      });
    },
    dropProject(project: ProjectModelExt) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete** this project?\n'
        + 'This will also delete **all data** related to this project in any way!\n'
        + 'This action is extremely dangerous!!\n'
        + `- "${project.name}"\n`
        + `- ID: ${project.project_id}`,
        (confirmationResponse) => {
          if (confirmationResponse === 'ACCEPT') {
            EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, too dangerous.'));
            /*
            // TODO
            API.core.projects.delete({
              projectId: project.project_id,
            }).then(() => {
              EventBus.emit(new ToastEvent('SUCCESS', `Deleted ${project.project_id}`));
              this.refreshData();
            }).catch(() => {
              EventBus.emit(new ToastEvent(
                'ERROR',
                `Failed to delete ${project.project_id}.`,
              ));
            });
            */
          }
        },
        'Delete project',
      ));
    },
  },
  computed: {
    filteredProjects(): ProjectModelExt[] {
      return this.projects.filter(
        (project: ProjectModelExt) => project.isNew
          || project.name.toLowerCase().indexOf(this.projectSearch.toLowerCase()) >= 0,
      );
    },
  },
});
</script>
