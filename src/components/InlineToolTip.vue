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
import { defineComponent } from "vue";

export default defineComponent({
  name: "InlineToolTip",
  props: {
    info: {
      type: String,
      required: false,
      default: undefined,
    },
    placement: {
      type: String,
      required: false,
      default: "top",
    },
    size: {
      type: String,
      required: false,
      default: "small",
    },
  },
});
</script>

<style scoped>
.nacsos-tooltip > .bottom {
  transform: translate(-50%, 75%);
}
</style>
