<script setup lang="ts">
import { computed, onMounted, PropType, ref } from "vue";
import { API, ignore } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { Filter } from "@/util/nql";
import { LabelCount } from "@/plugins/api/spec";
import NQLBox from "@/components/NQLBox.vue";
import ToggleIcon from "@/components/ToggleIcon.vue";
import RefreshIcon from "@/components/RefreshIcon.vue";

const props = defineProps({
  queryParsed: {
    type: Object as PropType<Filter[]>,
    required: false,
    default: () => [] as Filter[],
  },
  queryStr: {
    type: String,
    required: false,
    default: null,
  },
});
const showNql = ref<boolean>(false);
const nql = ref<string>(props.queryStr ?? "");
const query = ref<Filter[]>(props.queryParsed ?? []);

const labels = ref<LabelCount[]>([]);
const groupedLabels = computed(() =>
  labels.value.reduce<Record<string, LabelCount[]>>((grouped, label) => {
    if (!(label.scheme in grouped)) grouped[label.scheme] = [];
    grouped[label.scheme].push(label);
    return grouped;
  }, {}),
);

const resolutions = ref<LabelCount[]>([]);
const groupedResolutions = computed(() =>
  resolutions.value.reduce<Record<string, LabelCount[]>>((grouped, label) => {
    if (!(label.scheme in grouped)) grouped[label.scheme] = [];
    grouped[label.scheme].push(label);
    return grouped;
  }, {}),
);

const schemes = computed(() => new Set(Object.keys(groupedResolutions.value).concat(Object.keys(groupedLabels.value))));

function refresh() {
  API.stats
    .labelStatsApiStatsLabelsHumanPost({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      body: query.value[0],
    })
    .then((response) => {
      labels.value = response.data;
    })
    .catch(ignore);

  API.stats
    .labelStatsApiStatsLabelsResolvedPost({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      body: query.value[0],
    })
    .then((response) => {
      resolutions.value = response.data;
    })
    .catch(ignore);
}

onMounted(refresh);
</script>

<template>
  <div>
    <div class="d-flex flex-row mb-2">
      <RefreshIcon :refresh="refresh" class="me-2" />
      <ToggleIcon v-model:model="showNql" icon="search" />
    </div>

    <NQLBox v-show="showNql" :query="nql" :rows="2" @update:query-parsed="(nq) => (query = nq)" class="mb-2" />

    <div v-for="scheme in schemes" :key="scheme" class="mt-4">
      <h5>
        {{ scheme }}
        <router-link
          :to="{
            name: 'config-annotation-scheme-edit',
            params: { annotation_scheme_id: scheme },
          }"
          class="small"
        >
          <font-awesome-icon icon="up-right-from-square" />
        </router-link>
      </h5>

      <div class="d-flex flex-row flex-wrap" v-if="groupedLabels[scheme]">
        <span class="me-2 fw-bold">Annotations:</span>
        <div v-for="(label, i) in groupedLabels[scheme]" :key="i" class="me-2 mb-1 border rounded rounded-3">
          <span class="border-end p-1 bg-secondary rounded-start text-bg-primary">{{ label.key }}</span>
          <span class="border-end p-1 bg-secondary-subtle">
            {{ label.value_bool ?? label.value_float ?? label.value_int ?? label.multi }}
          </span>
          <span class="p-1 fw-bold">{{ label.num_items }}</span>
        </div>
      </div>

      <div class="d-flex flex-row flex-wrap" v-if="groupedResolutions[scheme]">
        <span class="me-2 fw-bold">Resolutions:</span>
        <div v-for="(label, i) in groupedResolutions[scheme]" :key="i" class="me-2 mb-1 border rounded rounded-3">
          <span class="border-end p-1 bg-secondary rounded-start text-bg-primary">{{ label.key }}</span>
          <span class="border-end p-1 bg-secondary-subtle">
            {{ label.value_bool ?? label.value_float ?? label.value_int ?? label.multi }}
          </span>
          <span class="p-1 fw-bold">{{ label.num_items }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
