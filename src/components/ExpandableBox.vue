<template>
  <div class="card">
    <div
      class="card-header small d-flex"
      :class="{ 'border-bottom-0': !expanded }"
      tabindex="0"
      role="button"
      @click="expanded = !expanded"
    >
      <slot name="head" />
      <font-awesome-icon class="text-muted ms-auto" :icon="['fas', expanded ? 'minus' : 'plus']" />
    </div>
    <div class="card-body" v-show="expanded">
      <slot name="body" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineOptions({ name: "ExpandableBox" });

const props = defineProps({
  initiallyOpen: {
    type: Boolean,
    default: true,
  },
});

const expanded = ref(props.initiallyOpen);
</script>

<style scoped></style>
