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
          <input v-model="projectSearch" type="text" aria-label="Search" placeholder="Search..." class="form-control" />
        </div>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" @click="resort('name')">
                Name
                <font-awesome-icon :icon="['fas', sorting.name]" />
              </th>
              <th scope="col" @click="resort('assi')">
                Project ID
                <font-awesome-icon :icon="['fas', sorting.assi]" />
              </th>
              <th scope="col" @click="resort('owner')">
                Owner(s)
                <font-awesome-icon :icon="['fas', sorting.owner]" />
              </th>
              <th scope="col" @click="resort('date')">
                Created
                <font-awesome-icon :icon="['fas', sorting.date]" />
              </th>
            </tr>
          </thead>
          <tbody v-for="project in sortedFilteredProjects" :key="project.project_id as string">
            <tr>
              <td>
                <div class="d-flex">
                  <div
                    v-if="project.description"
                    @click="project.showDesc = !project.showDesc"
                    class="text-muted me-2"
                    role="button"
                    tabindex="0"
                    @keyup.enter="project.showDesc = !project.showDesc"
                    @keyup.space="project.showDesc = !project.showDesc"
                  >
                    <font-awesome-icon :icon="['fas', 'info-circle']" />
                  </div>
                  <div @click="selectProject(project.project_id)" class="flex-grow-1" role="button" tabindex="0">
                    <project-type-icon :project-type="project.type" class="me-2" />
                    {{ project.name }}
                  </div>
                </div>
              </td>
              <td>
                <code>{{ project.project_id }}</code>
              </td>
              <td>
                <ul class="list-inline">
                  <li v-for="owner in project.owners" :key="owner.user_id as string" class="list-inline-item">
                    {{ owner.full_name }} <span class="text-muted small">({{ owner.affiliation }})</span>
                  </li>
                </ul>
              </td>
              <!--<td>?? open assignments</td>-->
              <td>{{ project.time_created?.slice(0, 10) }}</td>
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

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { md2html } from "@/util";
import "core-js/modules/es.array.to-sorted";
import { EventBus } from "@/plugins/events";
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from "@/plugins/events/events/projects";
import type { ProjectInfo } from "@/plugins/api/types";
import { API, toastReject } from "@/plugins/api";
import ProjectTypeIcon from "@/components/ProjectTypeIcon.vue";

defineOptions({ name: "ProjectListView" });

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

interface Sorting {
  name: Sort;
  owner: Sort;
  assi: Sort;
  date: Sort;
}

type ProjectInfoExt = ProjectInfo & { showDesc?: boolean };

const router = useRouter();

const projectList = ref<ProjectInfoExt[]>([]);
const projectSearch = ref("");
const sorting = reactive<Sorting>({
  name: Sort.sort,
  owner: Sort.sort,
  assi: Sort.sort,
  date: Sort["sort-down"],
});

onMounted(async () => {
  // clear the currentProjectStore to prevent side effects
  // currentProjectStore.clear();
  // get all projects from the server (that we have permission to access)
  API.projects
    .getAllProjectsApiProjectsListGet()
    .then((response) => {
      projectList.value = response.data;
    })
    .catch(toastReject);
});

function selectProject(projectId: string | null | undefined) {
  if (projectId) {
    EventBus.emit(new CurrentProjectSelectedEvent(projectId));
    EventBus.once(CurrentProjectSetEvent, () => {
      router.push({ name: "project-overview" });
    });
  }
}

function resort(field: keyof Sorting) {
  const currentVal = sorting[field];
  // reset all other column sorters
  if (field !== "name") sorting.name = Sort.sort;
  if (field !== "date") sorting.date = Sort.sort;
  if (field !== "owner") sorting.owner = Sort.sort;
  if (field !== "assi") sorting.assi = Sort.sort;

  // cycle through states
  if (currentVal === Sort.sort) {
    sorting[field] = Sort["sort-up"];
  } else if (currentVal === Sort["sort-up"]) {
    sorting[field] = Sort["sort-down"];
  } else if (currentVal === Sort["sort-down"]) {
    sorting[field] = Sort.sort;
  }
}

function renderMD(txt: string): string {
  return md2html(txt);
}

function ownerNames(p: ProjectInfoExt): string {
  return (p.owners ?? []).map((owner) => owner.full_name ?? "").join(" ");
}

const filteredProjects = computed<ProjectInfoExt[]>(() => {
  return projectList.value.filter(
    (project: ProjectInfoExt) => project.name.toLowerCase().indexOf(projectSearch.value.toLowerCase()) >= 0,
  );
});

const sortedFilteredProjects = computed<ProjectInfoExt[]>(() => {
  let comparator: (p1: ProjectInfoExt, p2: ProjectInfoExt) => [string, string];
  let dir: Sort;
  if (sorting.name !== Sort.sort) {
    comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [p1.name as string, p2.name as string];
    dir = sorting.name;
  } else if (sorting.assi !== Sort.sort) {
    comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [
      (p1.project_id ?? "") as string,
      (p2.project_id ?? "") as string,
    ];
    dir = sorting.assi;
  } else if (sorting.owner !== Sort.sort) {
    comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [ownerNames(p1), ownerNames(p2)];
    dir = sorting.owner;
  } else if (sorting.date !== Sort.sort) {
    comparator = (p1: ProjectInfoExt, p2: ProjectInfoExt) => [p1.time_created as string, p2.time_created as string];
    dir = sorting.date;
  } else {
    return filteredProjects.value;
  }

  return filteredProjects.value.toSorted((p1: ProjectInfoExt, p2: ProjectInfoExt) => {
    const [v1, v2] = comparator(p1, p2);
    if (v1 < v2) return dir === Sort["sort-up"] ? -1 : 1;
    if (v1 > v2) return dir === Sort["sort-up"] ? 1 : -1;
    return 0;
  });
});
</script>

<style scoped></style>
