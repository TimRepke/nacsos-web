<template>
  <component :is="component" :item="item" />
</template>

<script lang="ts">
import { AnyItem } from '@/types/items.d';
import { PropType, Component } from 'vue';
import TwitterItemComponent from '@/components/items/TwitterItem.vue';
import BaseItemComponent from '@/components/items/BaseItem.vue';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { ProjectType } from '@/plugins/api/api-core';

type TypeMapType = { [key in ProjectType]: Component };

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
      basic: BaseItemComponent,
      twitter: TwitterItemComponent,
      academic: BaseItemComponent, // FIXME: replace with correct component
      patents: BaseItemComponent, // FIXME: replace with correct component
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
