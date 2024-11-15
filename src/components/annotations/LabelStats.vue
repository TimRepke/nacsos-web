<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";
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

function refresh() {
  API.stats
    .labelStatsApiStatsLabelsPost({
      xProjectId: currentProjectStore.projectId as string,
      requestBody: query.value[0],
    })
    .then((response) => {
      labels.value = response.data;
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

    <div class="d-flex flex-row flex-wrap">
      <div v-for="(label, i) in labels" :key="i" class="me-2 mb-1 border rounded rounded-3">
        <span class="border-end p-1 bg-secondary rounded-start text-bg-primary">{{ label.key }}</span>
        <span class="border-end p-1 bg-secondary-subtle">
          {{ label.value_bool ?? label.value_float ?? label.value_int ?? label.multi }}
        </span>
        <span class="p-1 fw-bold">{{ label.num_items }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
