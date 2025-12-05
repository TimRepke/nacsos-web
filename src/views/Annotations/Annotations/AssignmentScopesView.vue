<template>
  <div>
    <div class="row mb-2">
      <h2>List of Assignments</h2>
    </div>
    <div class="row mb-2" v-if="annotationScopes.length > 0">
      <div class="col">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" class="col-2" @click="resort('date')">
                Created
                <font-awesome-icon :icon="['fas', sorting.date]" />
              </th>
              <th scope="col" class="col-3" @click="resort('name')">
                Name
                <font-awesome-icon :icon="['fas', sorting.name]" />
              </th>
              <th scope="col" class="col-1 text-center" @click="resort('open')">
                # Open
                <font-awesome-icon :icon="['fas', sorting.open]" />
              </th>
              <th scope="col" class="col-1 text-center"># Partial</th>
              <th scope="col" class="col-1 text-center"># Done</th>
              <th scope="col" class="col-1 text-center"># Assignments</th>
              <th scope="col" class="col-3" @click="resort('scheme')">
                Annotation scheme
                <font-awesome-icon :icon="['fas', sorting.scheme]" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="scope in sortedFilteredScopes" :key="scope.scope.assignment_scope_id as string">
              <router-link
                :to="{ name: 'project-annotate-item', params: { scope_id: scope.scope.assignment_scope_id } }"
                custom
                v-slot="{ navigate }"
              >
                <tr @click.stop="navigate" role="button">
                  <td class="col-2 text-muted small">{{ $util.dt2str(scope.scope.time_created) }}</td>
                  <td class="col-3">{{ scope.scope.name }}</td>
                  <td
                    class="col-1 text-center"
                    :class="{
                      'table-warning': scope.num_open > 0,
                      'table-success': scope.num_open == 0,
                    }"
                  >
                    {{ scope.num_open }}
                  </td>
                  <td
                    class="col-1 text-center"
                    :class="{
                      'table-warning': scope.num_partial > 0,
                    }"
                  >
                    {{ scope.num_partial }}
                  </td>
                  <td class="col-1 text-center">
                    {{ scope.num_completed }}
                    <span class="small text-muted"
                      >({{ ((scope.num_completed / scope.num_assignments) * 100).toFixed(0) }}%)
                    </span>
                  </td>
                  <td class="col-1 text-center">{{ scope.num_assignments }}</td>
                  <td class="col-3 text-muted small">{{ scope.scheme_name }}</td>
                </tr>
              </router-link>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else>
      <div class="card mb-3" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-2 position-relative">
            <font-awesome-icon
              :icon="['fas', 'tags']"
              class="position-absolute top-50 start-50 translate-middle img-fluid text-muted"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">No assignments, yet!</h5>
              <p class="card-text">
                Trying to load assignments for you, so far, it looks like there are none to be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import type { UserProjectAssignmentScope } from "@/plugins/api/types";
import { API, ignore } from "@/plugins/api";

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

export default defineComponent({
  name: "AssignmentScopesView",
  data() {
    return {
      sorting: {
        name: Sort.sort,
        scheme: Sort.sort,
        open: Sort.sort,
        date: Sort["sort-down"],
      } as Record<string, Sort>,
      annotationScopes: [] as UserProjectAssignmentScope[],
    };
  },
  async mounted() {
    API.annotations
      .getAssignmentScopesForUserApiAnnotationsAssignmentsScopesProjectIdGet({
        path: { project_id: currentProjectStore.projectId as string },
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
      .then((response) => {
        this.annotationScopes = response.data;
      })
      .catch(ignore);
  },
  methods: {
    resort(field: string) {
      const currentVal: Sort = this.sorting[field];
      // reset all other column sorters
      if (field !== "name") this.sorting.name = Sort.sort;
      if (field !== "scheme") this.sorting.scheme = Sort.sort;
      if (field !== "open") this.sorting.open = Sort.sort;
      if (field !== "date") this.sorting.date = Sort.sort;

      // cycle through states
      if (currentVal === Sort.sort) {
        this.sorting[field] = Sort["sort-up"];
      } else if (currentVal === Sort["sort-up"]) {
        this.sorting[field] = Sort["sort-down"];
      } else if (currentVal === Sort["sort-down"]) {
        this.sorting[field] = Sort.sort;
      }
    },
  },
  computed: {
    filteredScopes(): UserProjectAssignmentScope[] {
      return this.annotationScopes;
      // this.annotationScopes.filter(
      //   (scope: UserProjectAssignmentScope) => scope.scope.name.toLowerCase().indexOf(this.projectSearch.toLowerCase()) >= 0,
      // );
    },
    sortedFilteredScopes(): UserProjectAssignmentScope[] {
      let comparator: (
        p1: UserProjectAssignmentScope,
        p2: UserProjectAssignmentScope,
      ) => [string, string] | [number, number];
      let dir: Sort;
      if (this.sorting.name !== Sort.sort) {
        comparator = (p1: UserProjectAssignmentScope, p2: UserProjectAssignmentScope) => [
          p1.scope.name as string,
          p2.scope.name as string,
        ];
        dir = this.sorting.name;
      } else if (this.sorting.scheme !== Sort.sort) {
        comparator = (p1: UserProjectAssignmentScope, p2: UserProjectAssignmentScope) => [
          p1.scheme_name as string,
          p2.scheme_name as string,
        ];
        dir = this.sorting.scheme;
      } else if (this.sorting.open !== Sort.sort) {
        comparator = (p1: UserProjectAssignmentScope, p2: UserProjectAssignmentScope) => [
          p1.num_open as number,
          p2.num_open as number,
        ];
        dir = this.sorting.open;
      } else if (this.sorting.date !== Sort.sort) {
        comparator = (p1: UserProjectAssignmentScope, p2: UserProjectAssignmentScope) => [
          p1.scope.time_created as string,
          p2.scope.time_created as string,
        ];
        dir = this.sorting.date;
      } else {
        return this.filteredScopes;
      }

      return this.filteredScopes.toSorted((p1: UserProjectAssignmentScope, p2: UserProjectAssignmentScope) => {
        const [v1, v2] = comparator(p1, p2);
        if (v1 < v2) return dir === Sort["sort-up"] ? -1 : 1;
        if (v1 > v2) return dir === Sort["sort-up"] ? 1 : -1;
        return 0;
      });
    },
  },
});
</script>

<style scoped></style>
