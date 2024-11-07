<script setup lang="ts">
import { computed, ref, provide } from "vue";

const props = defineProps<{
  data: Record<string, any>[];
  defaultSort?: string;
  defaultOrder?: number;
}>();

const sortBy = ref<string | null>(props.defaultSort ?? null);
const sortOrder = ref<number>(props.defaultOrder ?? 1);

const sortedData = computed(() =>
  !sortBy.value
    ? props.data
    : props.data.toSorted((a, b) => {
        if (a[sortBy.value] >= b[sortBy.value]) {
          return sortOrder.value;
        }
        return -sortOrder.value;
      }),
);

function sort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = ((sortOrder.value + 2) % 3) - 1;
  } else {
    sortBy.value = field;
  }
}

provide("tableSort", {
  sortBy,
  sortOrder,
  sort,
});
</script>

<template>
  <table class="table table-hover">
    <thead>
      <slot name="head" />
    </thead>
    <tbody>
      <slot name="body" :sortedRows="sortedData" />
    </tbody>
  </table>
</template>

<style scoped></style>
