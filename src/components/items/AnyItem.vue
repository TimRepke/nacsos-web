<template>
  <component :is="component" :item="item" :highlighters="highlighters" />
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, markRaw } from "vue";
import type { PropType, Component } from "vue";
import type { AnyItem } from "@/types/items.d";
import { useCurrentProjectStore } from "@/stores/CurrentProjectStore";
import type { HighlighterModel, ItemType, ProjectModel } from "@/plugins/api/api-core";

type TypeMapType = { [key in ItemType]: Component };

export default defineComponent({
  name: "AnyItem",
  props: {
    item: {
      type: Object as PropType<AnyItem>,
      required: true,
      default: null,
    },
    highlighters: {
      type: Object as PropType<Array<HighlighterModel>>,
      required: false,
      default: undefined,
    },
  },
  data() {
    const typeMap: TypeMapType = {
      generic: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))),
      twitter: markRaw(defineAsyncComponent(() => import("@/components/items/TwitterItem.vue"))),
      academic: markRaw(defineAsyncComponent(() => import("@/components/items/AcademicItem.vue"))),
      lexis: markRaw(defineAsyncComponent(() => import("@/components/items/LexisNexisItem.vue"))),
      patents: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))), // FIXME: replace with correct component
    };
    const store = useCurrentProjectStore();
    const { type } = store.project as ProjectModel;
    return {
      component: typeMap[type as ItemType] as Component,
    };
  },
});
</script>

<style scoped></style>
