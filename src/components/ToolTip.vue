<template>
  <div class="nacsos-tooltip ms-2">
    <font-awesome-icon :icon="['fas', 'circle-question']" class="text-muted" />
    <span class="nacsos-tooltiptext medium">
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ToolTip',
});
</script>

<style scoped>

</style>
