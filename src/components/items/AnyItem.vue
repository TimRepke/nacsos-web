<template>
  <component :is="component" :item="item" />
</template>

<script lang="ts" setup>
import { defineAsyncComponent, markRaw } from "vue";
import type { PropType, Component } from "vue";
import type { AnyItem } from "@/types/items.d";
import { useCurrentProjectStore } from "@/stores/CurrentProjectStore";
import type { ItemType, ProjectModel } from "@/plugins/api/types";

type TypeMapType = { [key in ItemType]: Component };

defineOptions({ name: "AnyItem" });

defineProps({
  item: {
    type: Object as PropType<AnyItem>,
    required: true,
    default: null,
  },
});

const typeMap: TypeMapType = {
  generic: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))),
  twitter: markRaw(defineAsyncComponent(() => import("@/components/items/TwitterItem.vue"))),
  academic: markRaw(defineAsyncComponent(() => import("@/components/items/AcademicItem.vue"))),
  lexis: markRaw(defineAsyncComponent(() => import("@/components/items/LexisNexisItem.vue"))),
  patents: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))), // FIXME: replace with correct component
};
const store = useCurrentProjectStore();
const { type } = store.project as ProjectModel;
const component = typeMap[type as ItemType] as Component;
</script>

<style scoped></style>
