<script setup lang="ts">
import { computed, ref } from "vue";

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

const props = defineProps<{
  data: (Record<string, { raw: any; html?: string }> & { rowKey: string })[];
  columns: { name: string; key: string }[];
  defaultSort?: string;
}>();
const sortBy = ref<string>(props.defaultSort ?? props.columns[0].key);
const sortOrder = ref<number>(1);

const cols = computed<{ name: string; key: string; s: Sort }[]>(() =>
  props.columns.map((col) => ({
    ...col,
    s: col.key === sortBy.value ? (sortOrder.value > 0 ? Sort["sort-down"] : Sort["sort-up"]) : Sort.sort,
  })),
);

const sortedData = computed(() =>
  props.data.toSorted((a, b) => {
    if (a[sortBy.value].raw >= b[sortBy.value].raw) {
      return sortOrder.value;
    }
    return -sortOrder.value;
  }),
);

function sort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = -sortOrder.value;
  } else {
    sortBy.value = field;
  }
}
</script>

<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th v-for="col in cols" :key="col.key" @click="sort(col.key)">
          {{ col.name }}
          <font-awesome-icon :icon="['fas', col.s]" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="d in sortedData" :key="d.rowKey">
        <template v-for="col in cols" :key="col.key">
          <td v-if="d[col.key].html" v-html="d[col.key].html" />
          <td v-else>{{ d[col.key].raw }}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
