<template>
  <div>
    <h3>{{item.item_id}}</h3>
    <p>{{item.text}}</p>
  </div>
</template>

<script>
import { BaseItem as BaseItemModel } from '@/types/items/index.d';

export default {
  name: 'BaseItem',
  props: {
    item: {
      type: BaseItemModel,
    },
  },
};
</script>

<style scoped>

</style>
