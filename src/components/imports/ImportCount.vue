<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { ref } from "vue";

const props = defineProps({
  importId: { type: String, required: true },
});

const numItems = ref<number | null>(null);
const isLoading = ref<boolean>(false);

function refreshCount() {
  isLoading.value = true;
  API.imports
    .getImportCountsApiImportsImportImportIdCountGet({
      importId: props.importId,
      xProjectId: currentProjectStore.projectId as string,
    })
    .then((response) => {
      numItems.value = response.data;
      isLoading.value = false;
    })
    .catch(() => {
      numItems.value = null;
      isLoading.value = false;
    });
}
</script>

<template>
  <span>
    {{ numItems ?? "[not loaded]" }}

    <span class="spinner-border spinner-border-sm text-secondary" role="status" v-if="isLoading">
      <span class="visually-hidden">Loading...</span>
    </span>

    <span v-else class="clickable-icon" @click="refreshCount">
      <font-awesome-icon icon="refresh" class="fa-rotate-90" />
    </span>
  </span>
</template>
