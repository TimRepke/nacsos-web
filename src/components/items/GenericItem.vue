<template>
  <component :is="component" :item="item"></component>
</template>

<script lang="ts">
import { AnyItem } from '@/types/items/index.d';
import { PropType } from 'vue';
import TwitterItemComponent from '@/components/items/TwitterItem.vue';
import BaseItemComponent from '@/components/items/BaseItem.vue';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';

export default {
  name: 'GenericItem',
  props: {
    item: {
      type: Object as PropType<AnyItem>,
    },
  },
  data() {
    const typeMap = {
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
