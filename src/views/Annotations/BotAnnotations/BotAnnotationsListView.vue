<template>
  <div>
    <div class="row mb-2">
      <h2>List of bot annotations</h2>
    </div>

    <div class="form-check form-switch mb-2">
      <input class="form-check-input" type="checkbox" role="switch" id="incl-resol-switch" v-model="includeResolve" />
      <label class="form-check-label" for="incl-resol-switch">Show resolutions</label>
    </div>

    <div class="row mb-2" v-if="filteredAnnotations.length > 0">
      <div class="col">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" class="col-1 text-center" @click="resort('kind')">
                Kind
                <font-awesome-icon :icon="['fas', sorting.kind]" />
              </th>
              <th scope="col" class="col-2" @click="resort('date')">
                Created
                <font-awesome-icon :icon="['fas', sorting.date]" />
              </th>
              <th scope="col" class="col-3" @click="resort('name')">
                Name
                <font-awesome-icon :icon="['fas', sorting.name]" />
              </th>
              <th scope="col" class="col-1 text-center"># Items</th>
              <th scope="col" class="col-1 text-center"># Annotations</th>
              <th scope="col" class="col-3" @click="resort('scheme')">
                Annotation scheme
                <font-awesome-icon :icon="['fas', sorting.scheme]" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="bot in sortedFilteredAnnotations" :key="bot.bot_annotation_metadata_id as string">
              <tr>
                <td class="col-1 text-center small">{{ bot.kind }}</td>
                <td class="col-2 text-muted small">{{ $util.dt2str(bot.time_created) }}</td>
                <td class="col-3">
                  {{ bot.name }}<br /><code>{{ bot.bot_annotation_metadata_id }}</code>
                </td>
                <td class="col-1 text-center">{{ bot.num_annotated_items }}</td>
                <td class="col-1 text-center">{{ bot.num_annotations }}</td>
                <td class="col-3 text-muted small">
                  <template v-if="bot.annotation_scheme_id">
                    {{ bot.annotation_scheme_id }}
                    <router-link
                      :to="{
                        name: 'config-annotation-scheme-edit',
                        params: { annotation_scheme_id: bot.annotation_scheme_id },
                      }"
                      class="small ms-1"
                    >
                      <font-awesome-icon icon="up-right-from-square" />
                    </router-link>
                  </template>
                </td>
              </tr>
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
              <h5 class="card-title">No bot annotations, yet!</h5>
              <p class="card-text">
                Trying to load bot annotations for you, so far, it looks like there are none to be found.
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
import type { BotMetaInfo } from "@/plugins/api/types";
import { API, ignore } from "@/plugins/api";

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

export default defineComponent({
  name: "BotAnnotationsListView",
  data() {
    return {
      includeResolve: false,
      sorting: {
        name: Sort.sort,
        scheme: Sort.sort,
        kind: Sort.sort,
        date: Sort["sort-down"],
      } as Record<string, Sort>,
      annotations: [] as BotMetaInfo[],
    };
  },
  async mounted() {
    API.annotations
      .getBotAnnotationsApiAnnotationsBotAnnotationsGet({
        query: { include_resolve: true },
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
      .then((response) => {
        this.annotations = response.data;
      })
      .catch(ignore);
  },
  methods: {
    resort(field: string) {
      const currentVal: Sort = this.sorting[field];
      // reset all other column sorters
      if (field !== "name") this.sorting.name = Sort.sort;
      if (field !== "scheme") this.sorting.scheme = Sort.sort;
      if (field !== "kind") this.sorting.kind = Sort.sort;
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
    filteredAnnotations(): BotMetaInfo[] {
      return this.annotations.filter((bot: BotMetaInfo) => (!this.includeResolve ? bot.kind != "RESOLVE" : true));
    },
    sortedFilteredAnnotations(): BotMetaInfo[] {
      let comparator: (p1: BotMetaInfo, p2: BotMetaInfo) => [string, string] | [number, number];
      let dir: Sort;
      if (this.sorting.name !== Sort.sort) {
        comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.name as string, p2.name as string];
        dir = this.sorting.name;
      } else if (this.sorting.scheme !== Sort.sort) {
        comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [
          p1.annotation_scheme_id as string,
          p2.annotation_scheme_id as string,
        ];
        dir = this.sorting.scheme;
      } else if (this.sorting.kind !== Sort.sort) {
        comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.kind as string, p2.kind as string];
        dir = this.sorting.open;
      } else if (this.sorting.date !== Sort.sort) {
        comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.time_created as string, p2.time_created as string];
        dir = this.sorting.date;
      } else {
        return this.filteredAnnotations;
      }

      return this.filteredAnnotations.toSorted((p1: BotMetaInfo, p2: BotMetaInfo) => {
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
