<script setup lang="ts">
import { currentProjectStore } from "@/stores";
import { useRoute } from "vue-router";
import { type Component, defineAsyncComponent, markRaw, onMounted, ref } from "vue";
import type { AcademicItemModel, ItemType, ProjectModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";

const componentMap: { [key in ItemType]: Component } = {
  academic: markRaw(defineAsyncComponent(() => import("@/components/items-edit/AcademicItem.vue"))),
  generic: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))), // FIXME: Not implemented yet
  twitter: markRaw(defineAsyncComponent(() => import("@/components/items/TwitterItem.vue"))), // FIXME: Not implemented yet
  lexis: markRaw(defineAsyncComponent(() => import("@/components/items/LexisNexisItem.vue"))), // FIXME: Not implemented yet
  patents: markRaw(defineAsyncComponent(() => import("@/components/items/GenericItem.vue"))), // FIXME: Not implemented yet
};
const component = componentMap[(currentProjectStore.project as ProjectModel).type];

const route = useRoute();
const item = ref<AcademicItemModel | null>(null);
await currentProjectStore.projectSchemes.ensureLoaded();

onMounted(async () => {
  item.value = (
    await API.item.getItemInfoApiItemInfoItemIdGet({
      itemId: route.params.item_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
  ).data;
});
</script>

<template>
  <div class="row">
    <div class="col-lg-6 col">
      <template v-if="item">
        <component :is="component" :item="item" />
      </template>
      <div v-else class="placeholder-glow">
        <span class="placeholder col-8"></span>
        <span class="placeholder col-10"></span>
        <span class="placeholder col-9"></span>
      </div>
    </div>
    <div class="col-lg-6 col">Labels</div>
  </div>
  Item details
  {{ route.params.item_id }}
</template>

<style scoped></style>
