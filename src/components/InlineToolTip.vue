<template>
  <template v-if="!info">
    <slot />
  </template>
  <template v-else>
    <span class="nacsos-tooltip">
      <slot />
      <span class="nacsos-tooltiptext" :class="[size, placement]">
        {{ info }}
      </span>
    </span>
  </template>
</template>

<script lang="ts">

// type Placement = 'top' | 'left' | 'bottom' | 'right';
// type Size = 'small' | 'medium' | 'wide';
export default {
  name: 'InlineToolTip',
  props: {
    info: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      required: false,
      default: 'top',
    },
    size: {
      type: String,
      required: false,
      default: 'small',
    },
  },
};
</script>
