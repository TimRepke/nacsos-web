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
                <td class="col-2 text-muted small">{{ dt2str(bot.time_created) }}</td>
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

<script lang="ts" setup>
import { dt2str } from "@/util";
import { computed, onMounted, ref } from "vue";
import { currentProjectStore } from "@/stores";
import type { BotMetaInfo } from "@/plugins/api/types";
import { API, ignore } from "@/plugins/api";

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

defineOptions({ name: "BotAnnotationsListView" });

const includeResolve = ref(false);
const sorting = ref({
  name: Sort.sort,
  scheme: Sort.sort,
  kind: Sort.sort,
  date: Sort["sort-down"],
} as Record<string, Sort>);
const annotations = ref<BotMetaInfo[]>([]);

onMounted(() => {
  API.annotations
    .getBotAnnotationsApiAnnotationsBotAnnotationsGet({
      query: { include_resolve: true },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      annotations.value = response.data;
    })
    .catch(ignore);
});

function resort(field: string) {
  const currentVal: Sort = sorting.value[field];
  // reset all other column sorters
  if (field !== "name") sorting.value.name = Sort.sort;
  if (field !== "scheme") sorting.value.scheme = Sort.sort;
  if (field !== "kind") sorting.value.kind = Sort.sort;
  if (field !== "date") sorting.value.date = Sort.sort;

  // cycle through states
  if (currentVal === Sort.sort) {
    sorting.value[field] = Sort["sort-up"];
  } else if (currentVal === Sort["sort-up"]) {
    sorting.value[field] = Sort["sort-down"];
  } else if (currentVal === Sort["sort-down"]) {
    sorting.value[field] = Sort.sort;
  }
}

const filteredAnnotations = computed<BotMetaInfo[]>(() => {
  return annotations.value.filter((bot: BotMetaInfo) => (!includeResolve.value ? bot.kind != "RESOLVE" : true));
});
const sortedFilteredAnnotations = computed<BotMetaInfo[]>(() => {
  let comparator: (p1: BotMetaInfo, p2: BotMetaInfo) => [string, string] | [number, number];
  let dir: Sort;
  if (sorting.value.name !== Sort.sort) {
    comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.name as string, p2.name as string];
    dir = sorting.value.name;
  } else if (sorting.value.scheme !== Sort.sort) {
    comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [
      p1.annotation_scheme_id as string,
      p2.annotation_scheme_id as string,
    ];
    dir = sorting.value.scheme;
  } else if (sorting.value.kind !== Sort.sort) {
    comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.kind as string, p2.kind as string];
    dir = sorting.value.open;
  } else if (sorting.value.date !== Sort.sort) {
    comparator = (p1: BotMetaInfo, p2: BotMetaInfo) => [p1.time_created as string, p2.time_created as string];
    dir = sorting.value.date;
  } else {
    return filteredAnnotations.value;
  }

  return filteredAnnotations.value.toSorted((p1: BotMetaInfo, p2: BotMetaInfo) => {
    const [v1, v2] = comparator(p1, p2);
    if (v1 < v2) return dir === Sort["sort-up"] ? -1 : 1;
    if (v1 > v2) return dir === Sort["sort-up"] ? 1 : -1;
    return 0;
  });
});
</script>

<style scoped></style>
