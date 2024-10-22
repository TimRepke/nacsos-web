<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";

const props = defineProps({
  refresh: { type: Function, required: true },
  timeout: { type: Number, required: false, default: 1000 },
});

enum IconState {
  Ready,
  Loading,
  Failed,
  Success,
}

// Refresh icon status
const state = ref<IconState>(IconState.Ready);

async function reload() {
  try {
    state.value = IconState.Loading;
    await props.refresh();
    state.value = IconState.Success;
  } catch {
    state.value = IconState.Failed;
  } finally {
    setTimeout(() => (state.value = IconState.Ready), props.timeout);
  }
}
</script>

<template>
  <span>
    <span v-if="state == IconState.Loading" class="spinner-border spinner-border-sm text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </span>

    <span v-else-if="state == IconState.Ready" class="clickable-icon" @click="reload">
      <font-awesome-icon icon="refresh" />
    </span>

    <span v-else-if="state == IconState.Success" class="text-success">
      <font-awesome-icon :icon="['far', 'circle-check']" />
    </span>

    <span v-else-if="state == IconState.Failed" class="text-danger">
      <font-awesome-icon :icon="['far', 'circle-xmark']" />
    </span>
  </span>
</template>
