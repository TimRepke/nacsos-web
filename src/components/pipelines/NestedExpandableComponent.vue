<template>
  <div class="border-start ps-3">
    <ul class="list-unstyled">
      <li v-for="(subtree, key) in tree" :key="key">
        <template v-if="$util.isFunctionInfo(subtree)">
          <code>{{ subtree.function }}(&sdot;)</code><br>
          <span>{{ subtree.name }}</span>
          <font-awesome-icon
            role="button"
            class="ms-1 text-muted"
            :icon="['fas', 'circle-info']"
            @click="$emit('showInfo', subtree)" />
          <font-awesome-icon
            role="button"
            class="text-muted ms-1"
            :icon="['fas', 'wrench']"
            @click="$emit('useFunc', subtree)" />
        </template>
        <template v-else-if="typeof subtree === 'object'">
          <span @click="opened[key] = !opened[key]" role="button" tabindex="-1">
            <font-awesome-icon
              class="text-muted"
              style="margin-left: -0.3em"
              :icon="['fas', (opened[key]) ? 'caret-down' : 'caret-right']" />
            {{ key }}
          </span>
          <div v-show="opened[key]">
            <NestedExpandableComponent
              :tree="subtree"
              @showInfo="$emit('showInfo', $event)"
              @useFunc="$emit('useFunc', $event)" />
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { NestedLibrary } from '@/types/pipelines.d';
import type { FunctionInfo } from '@/plugins/api/api-pipe';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NestedExpandableComponent',
  emits: {
    showInfo: (info: FunctionInfo) => info,
    useFunc: (info: FunctionInfo) => info,
  },
  props: {
    tree: {
      type: Object as PropType<NestedLibrary>,
      optional: false,
      default: null,
    },
  },
  data() {
    return {
      opened: Object.fromEntries(Object.keys(this.tree).map((key: string) => [key, true])),
    };
  },
});
</script>

<style scoped>
</style>
