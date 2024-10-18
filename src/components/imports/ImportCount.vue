<script setup lang="ts">
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { ref } from "vue";
import RefreshIcon from "@/components/RefreshIcon.vue";

const props = defineProps({
  importId: { type: String, required: true },
});

const numItems = ref<number | null>(null);

async function refreshCount() {
  try {
    numItems.value = (
      await API.imports.getImportCountsApiImportsImportImportIdCountGet({
        importId: props.importId,
        xProjectId: currentProjectStore.projectId as string,
      })
    ).data;
  } catch {
    numItems.value = null;
  }
}
</script>

<template>
  <span>
    {{ numItems ?? "[not loaded]" }}

    <RefreshIcon :refresh="refreshCount" />
  </span>
</template>
