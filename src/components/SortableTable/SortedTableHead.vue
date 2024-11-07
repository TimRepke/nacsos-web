<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { Sort, sortTableStoreKey } from "@/components/SortableTable/index";

const props = defineProps<{
  colKey: string;
}>();
const { sortBy, sortOrder, sort } = inject(sortTableStoreKey, {
  sortBy: ref(null),
  sortOrder: ref(0),
  sort: () => {},
});
const icon = computed(() =>
  props.colKey === sortBy.value ? [Sort["sort-down"], Sort.sort, Sort["sort-up"]][sortOrder.value + 1] : Sort.sort,
);
</script>

<template>
  <th @click="sort(colKey)">
    <font-awesome-icon :icon="['fas', icon]" class="me-2" />
    <slot />
  </th>
</template>

<style scoped></style>
