<template>
  <div class="card m-2 p-0 text-start">
    <div class="card-body">
      <p class="card-text" v-html="htmlText" />
    </div>
    <div class="card-footer d-flex justify-content-between small text-muted" v-if="item.meta">
      <ul class="list-unstyled">
        <template v-for="(value, key) in item.meta" :key="key">
          <li v-if="!key.startsWith('_')">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { marked } from 'marked';
import { BaseItem as BaseItemModel } from '@/types/items.d';

export default {
  name: 'GenericItem',
  props: {
    item: {
      type: Object as PropType<BaseItemModel>,
      required: true,
      default: null,
    },
  },
  computed: {
    htmlText() {
      return marked(this.item.text);
    },
  },
};
</script>

<style scoped>

</style>
