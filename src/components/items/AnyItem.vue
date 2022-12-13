<template>
  <component :is="component" :item="item" />
</template>

<script lang="ts">
import { AnyItem } from '@/types/items.d';
import { PropType, Component } from 'vue';
import TwitterItemComponent from '@/components/items/TwitterItem.vue';
import AcademicItemComponent from '@/components/items/AcademicItem.vue';
import GenericItemComponent from '@/components/items/GenericItem.vue';
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
      generic: GenericItemComponent,
      twitter: TwitterItemComponent,
      academic: AcademicItemComponent, // FIXME: replace with correct component
      patents: GenericItemComponent, // FIXME: replace with correct component
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
