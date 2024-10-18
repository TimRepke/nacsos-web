<script setup lang="ts">
import { useCurrentProjectStore } from "@/stores/CurrentProjectStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ConfirmationButton from "@/components/ConfirmationButton.vue";

const projectStore = useCurrentProjectStore();
</script>

<template>
  <ul class="list-group list-group-horizontal">
    <li class="list-group-item bg-warning-subtle" v-if="projectStore.hasRunningImport">Busy</li>
    <li class="list-group-item bg-success-subtle" v-else>Ready</li>
    <li class="list-group-item" v-if="projectStore.userCanResetImportMutex">
      <ConfirmationButton @accepted="projectStore.unsetImportMutex" btnStyle="btn-sm btn-outline-secondary"
        >Clear mutex
      </ConfirmationButton>
    </li>
    <li class="list-group-item clickable-icon" @click="projectStore.refreshInfo">
      <font-awesome-icon :icon="['fas', 'refresh']" />
    </li>
  </ul>
</template>

<style scoped></style>
