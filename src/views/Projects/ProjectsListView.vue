<template>
  <div>
    <div class="row mb-2">
      <h2>Projects</h2>
    </div>
    <div class="row mb-3 g-0">
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
    </div>
    <div class="row mb-2">
      <div class="col">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" @click="resort('name')">Name
                <font-awesome-icon :icon="['fas', sorting.name]" />
              </th>
              <th scope="col" @click="resort('owner')">Owner(s)
                <font-awesome-icon :icon="['fas', sorting.owner]" />
              </th>
              <th scope="col" @click="resort('assi')">Assignments
                <font-awesome-icon :icon="['fas', sorting.assi]" />
              </th>
              <th scope="col" @click="resort('date')">Created
                <font-awesome-icon :icon="['fas', sorting.date]" />
              </th>
            </tr>
          </thead>
          <tbody
            v-for="project in sortedFilteredProjects"
            :key="project.project_id">
            <tr>
              <td>
                <div class="d-flex">
                  <div v-if="project.description" @click="project.showDesc = !project.showDesc" class="text-muted me-2">
                    <font-awesome-icon :icon="['fas', 'info-circle']" />
                  </div>
                  <div @click="selectProject(project.project_id)" class="flex-grow-1" role="button" tabindex="0">
                    <project-type-icon :project-type="project.type" class="me-2" />
                    {{ project.name }}
                  </div>
                </div>
              </td>
              <td>
                <ul class="list-inline">
                  <li v-for="owner in project.owners" :key="owner.user_id" class="list-inline-item">
                    {{ owner.full_name }} <span class="text-muted small">({{ owner.affiliation }})</span>
                  </li>
                </ul>
              </td>
              <td>?? open assignments

              </td>
              <td>{{ project.time_created.slice(0, 10) }}</td>
            </tr>
            <tr v-if="project.showDesc && project.description">
              <td colspan="4">
                <div v-html="renderMD(project.description)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { marked } from 'marked';
import 'core-js/modules/es.array.to-sorted';
import { EventBus } from '@/plugins/events';
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from '@/plugins/events/events/projects';
import type { ProjectInfo } from '@/plugins/api/api-core';
import { API, toastReject } from '@/plugins/api';
import { ItemType } from '@/plugins/api/api-core';
import ProjectTypeIcon from '@/components/ProjectTypeIcon.vue';

enum Sort {
  sort = 'sort', // ignored
  'sort-up' = 'sort-up', // ascending
  'sort-down' = 'sort-down', // descending
}

interface Sorting {
  name: Sort;
  owner: Sort;
  assi: Sort;
  date: Sort;
}

type ProjectInfoExt = ProjectInfo & { showDesc?: boolean };

export default defineComponent({
  name: 'ProjectListView',
  components: { ProjectTypeIcon },
  data() {
    return {
      projectList: [] as ProjectInfoExt[],
      projectSearch: '',
      sorting: {
        name: Sort.sort,
        owner: Sort.sort,
        assi: Sort.sort,
        date: Sort['sort-down'],
      } as Sorting,
      projectTypes: ItemType,
    };
  },
  async mounted() {
    // clear the currentProjectStore to prevent side effects
    // currentProjectStore.clear();
    // get all projects from the server (that we have permission to access)
    API.core.projects.getAllProjectsApiProjectsListGet()
      .then((response) => { this.projectList = response.data; })
      .catch(toastReject);
  },
  methods: {
    selectProject(projectId: string) {
      EventBus.emit(new CurrentProjectSelectedEvent(projectId));
      EventBus.once(CurrentProjectSetEvent, () => {
        this.$router.push({ name: 'project-overview' });
      });
    },
    resort(field: keyof Sorting) {
      const currentVal = this.sorting[field];
      // reset all other column sorters
      if (field !== 'name') this.sorting.name = 'sort';
      if (field !== 'date') this.sorting.date = 'sort';
      if (field !== 'owner') this.sorting.owner = 'sort';
      if (field !== 'assi') this.sorting.assi = 'sort';

      // cycle through states
      if (currentVal === Sort.sort) {
        this.sorting[field] = Sort['sort-up'];
      } else if (currentVal === Sort['sort-up']) {
        this.sorting[field] = Sort['sort-down'];
      } else if (currentVal === Sort['sort-down']) {
        this.sorting[field] = Sort.sort;
      }
    },
    renderMD(txt: string): string {
      return marked(txt);
    },
  },
  computed: {
    filteredProjects(): ProjectInfoExt[] {
      return this.projectList.filter(
        (project: ProjectInfoExt) => project.name.toLowerCase().indexOf(this.projectSearch.toLowerCase()) >= 0,
      );
    },
    sortedFilteredProjects(): ProjectInfoExt[] {
      let comparator: (p1: ProjectInfoExt, p2: ProjectInfoExt) => [string, string];
      let dir: Sort;
      if (this.sorting.name !== Sort.sort) {
        comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [p1.name as string, p2.name as string];
        dir = this.sorting.name;
      } else if (this.sorting.date !== Sort.sort) {
        comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [p1.time_created as string, p2.time_created as string];
        dir = this.sorting.date;
      } else {
        return this.filteredProjects;
      }

      return this.filteredProjects.toSorted((p1: ProjectInfoExt, p2: ProjectInfoExt) => {
        const [v1, v2] = comparator(p1, p2);
        if (v1 < v2) return (dir === Sort['sort-up']) ? -1 : 1;
        if (v1 > v2) return (dir === Sort['sort-up']) ? 1 : -1;
        return 0;
      });
    },
  },
});
</script>

<style scoped>

</style>
