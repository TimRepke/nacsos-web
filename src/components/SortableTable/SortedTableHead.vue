<script setup lang="ts">
import { computed, inject } from "vue";
import { Sort } from "@/components/SortableTable/index";

const props = defineProps<{
  colKey: string;
}>();
const { sortBy, sortOrder, sort } = inject("tableSort");
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
