<template>
  <span v-for="(value, user_i) in annotation" :key="user_i">
    <InlineToolTip :info="`key: ${info.key} Value: ${!!value}`">
      <template v-if="value === null">
        <font-awesome-icon :icon="['fas', 'question']" class="border p-1 bg-light" style="height: 1rem; width: 1rem;" />
      </template>
      <template v-else-if="!!value">
        <font-awesome-icon :icon="['fas', 'check']" class="border text-light p-1 bg-success" style="height: 1rem; width: 1rem;" />
      </template>
      <template v-else>
        <font-awesome-icon :icon="['fas', 'xmark']" class="border text-light p-1 bg-danger" style="height: 1rem; width: 1rem;" />
      </template>
    </InlineToolTip>
  </span>
</template>

<script lang="ts">

import { FlattenedAnnotationSchemeLabel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';

export default {
  name: 'BoolLabel',
  components: { InlineToolTip },
  props: {
    users: {
      type: Array < String >,
      default: [],
    },
    info: FlattenedAnnotationSchemeLabel,
    annotation: {
      type: Array < Boolean >,
      default: [],
    },
  },
};
</script>
