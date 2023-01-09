<template>
  <span class="badge align-middle" :class="[background, (rounded) ? 'rounded-pill' : '']">
    <span class="pill-text mb-1 mt-1 me-2">
      <slot />
    </span>
    <span class="pill-text">
      <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="$emit('clicked-x')" />
    </span>
  </span>
</template>

<script lang="ts">

import type { PropType } from 'vue';
import { defineComponent } from 'vue';

type BackgroundColour = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

export default defineComponent({
  name: 'ClosablePill',
  emits: ['clicked-x'],
  props: {
    colour: {
      type: String as PropType<BackgroundColour>,
      default: 'primary',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    background(): string {
      return `text-bg-${this.colour}`;
    },
  },
});
</script>

<style scoped>
.pill-text > .btn-close {
  font-size: 0.5em;
}

.pill-text {
  vertical-align: middle;
  display: inline-block;
  /*height: 1.3em;*/
}

/*
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 0.7em;
  --bs-badge-font-weight: 500;
}
*/
</style>
