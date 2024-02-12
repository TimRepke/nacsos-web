<template>
  <div class="nacsos-tooltip ms-2">
    <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
    <span class="nacsos-tooltiptext medium" :class="[size, placement]">
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
/*
TODO: make size small, medium, large as prop
TODO: make position (top, left, right, bottom) as prop
TODO: move CSS from style.css to here
TODO: make size adaptable to content
TODO: make sure this works on mobile (or hints are hidden on mobile)
TODO: should this always be a question mark or could it also be a lower-cased "i"?
*/
import { defineComponent } from "vue";

// type Placement = 'top' | 'left' | 'bottom' | 'right';
// type Size = 'small' | 'medium' | 'wide';
export default defineComponent({
  name: "ToolTip",
  props: {
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

<style scoped></style>
