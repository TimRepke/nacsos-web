<script setup lang="ts">
import { computed, ref, provide } from "vue";
import { sortTableStoreKey } from "@/components/SortableTable/index";

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
        const av = a[sortBy.value as string];
        const bv = b[sortBy.value as string];
        const aEmpty = av === undefined || av === null;
        const bEmpty = bv === undefined || bv === null;
        if (aEmpty && bEmpty) {
          return 0;
        }
        if (aEmpty) {
          return 1; // empty cells always sort to the end
        }
        if (bEmpty) {
          return -1;
        }
        if (av === bv) {
          return 0;
        }
        return (av > bv ? 1 : -1) * sortOrder.value;
      }),
);

function sort(field: string) {
  if (sortBy.value === field) {
    sortOrder.value = ((sortOrder.value + 2) % 3) - 1;
  } else {
    sortBy.value = field;
    sortOrder.value = props.defaultOrder ?? 1;
  }
}

provide(sortTableStoreKey, {
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
