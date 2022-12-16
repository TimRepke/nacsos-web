<template>
  <component :is="component" :item="item" />
</template>

<script lang="ts">
import { AnyItem } from '@/types/items.d';
import { PropType, Component, markRaw, defineAsyncComponent } from 'vue';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { ItemType } from '@/plugins/api/api-core';

type TypeMapType = { [key in ItemType]: Component };

export default {
  name: 'GenericItem',
  props: {
    item: {
      type: Object as PropType<AnyItem>,
      required: true,
      default: null,
    },
  },
  data() {
    const typeMap: TypeMapType = {
      generic: markRaw(defineAsyncComponent(() => import('@/components/items/GenericItem.vue'))),
      twitter: markRaw(defineAsyncComponent(() => import('@/components/items/TwitterItem.vue'))),
      academic: markRaw(defineAsyncComponent(() => import('@/components/items/AcademicItem.vue'))),
      patents: markRaw(defineAsyncComponent(() => import('@/components/items/GenericItem.vue'))), // FIXME: replace with correct component
    };
    const store = useCurrentProjectStore();
    const { type } = store.project;
    return {
      component: typeMap[type],
    };
  },
};
</script>

<style scoped>

</style>
