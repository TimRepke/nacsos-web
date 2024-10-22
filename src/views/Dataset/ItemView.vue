<script setup lang="ts">
import { currentProjectStore, platformUsersStore } from "@/stores";
import { useRoute } from "vue-router";
import { type Component, computed, defineAsyncComponent, markRaw, onMounted, ref } from "vue";
import type {
  AcademicItemModel,
  AnnotationModel,
  BotAnnotationModel,
  ImportDetails,
  ImportM2M,
  ItemType,
  ProjectModel,
} from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { Revision } from "@/types/imports";
import SortedTable from "@/components/SortedTable.vue";

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
const imports = ref<ImportDetails[]>([]);
const m2ms = ref<ImportM2M[]>([]);
const annotations = ref<AnnotationModel[]>([]);
const botAnnotations = ref<BotAnnotationModel[]>([]);
await currentProjectStore.projectSchemes.ensureLoaded();

onMounted(async () => {
  item.value = (
    await API.item.getItemInfoApiItemInfoItemIdGet({
      itemId: route.params.item_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
  ).data;

  imports.value = (
    await API.imports.getProjectImportsApiImportsListDetailsGet({ xProjectId: currentProjectStore.projectId as string })
  ).data;

  [annotations.value, botAnnotations.value] = (
    await API.item.getItemLabelsApiItemLabelsItemIdGet({
      itemId: route.params.item_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
  ).data as [AnnotationModel[], BotAnnotationModel[]];

  m2ms.value = (
    await API.item.getItemM2MsApiItemM2MsItemIdGet({
      itemId: route.params.item_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
  ).data;
});

const revisions = computed<Record<string, Revision>>(() =>
  Object.fromEntries(
    imports.value.flatMap((imp) =>
      imp.revisions.map<[string, Revision]>((rev) => [
        `${imp.import_id}|${rev.import_revision_counter}`,
        { i: imp, r: rev },
      ]),
    ),
  ),
);

const table = computed(() =>
  annotations.value.map((anno) => {
    const val = anno.value_bool ?? anno.value_int ?? anno.value_str ?? anno.value_float ?? anno.multi_int;
    return {
      rowKey: { raw: anno.annotation_id },
      key: { raw: anno.key, html: `<code>${anno.key}</code>` },
      value: { raw: val, html: `<code><strong>${val}</strong></code>` },
      user: { raw: platformUsersStore.userLookup[anno.user_id]?.username ?? "??" },
      dt: { raw: anno.time_created?.substring(0, 19).replace("T", " ") },
    };
  }),
);
const tableColumns = [
  { name: "key", key: "key" },
  { name: "value", key: "value" },
  { name: "user", key: "user" },
  { name: "timestamp", key: "dt" },
];

const botTable = computed(() =>
  botAnnotations.value.map((anno) => {
    const val = anno.value_bool ?? anno.value_int ?? anno.value_str ?? anno.value_float ?? anno.multi_int;
    return {
      rowKey: { raw: anno.bot_annotation_id },
      key: { raw: anno.key, html: `<code>${anno.key}</code>` },
      value: { raw: val, html: `<code><strong>${val}</strong></code>` },
      dt: { raw: anno.time_created?.substring(0, 19).replace("T", " ") },
    };
  }),
);
const botTableColumns = [
  { name: "key", key: "key" },
  { name: "value", key: "value" },
  { name: "timestamp", key: "dt" },
];
</script>

<template>
  <div class="row">
    <div class="col-lg-6 col">
      <component v-if="item" :is="component" :item="item" :revisions="revisions" />

      <div v-else class="placeholder-glow">
        <span class="placeholder col-8"></span>
        <span class="placeholder col-10"></span>
        <span class="placeholder col-9"></span>
      </div>
    </div>
    <div class="col-lg-6 col">
      <h2>Human labels</h2>
      <SortedTable :data="table" :columns="tableColumns" default-sort="key" class="mb-3" />

      <h2>Bot labels (incl resolutions)</h2>
      <SortedTable :data="botTable" :columns="botTableColumns" default-sort="key" class="mb-3" />

      <h2>Linked import revisions</h2>
      <ul>
        <li v-for="m2m in m2ms" :key="`${m2m.import_id}|${m2m.item_id}`">
          <ul class="list-unstyled">
            <li>
              <strong>{{ revisions[`${m2m.import_id}|${m2m.first_revision}`]?.i.name }}</strong>
            </li>
            <li>
              <strong>First revision:</strong> {{ m2m.first_revision }} /
              <em>{{ revisions[`${m2m.import_id}|${m2m.first_revision}`]?.r.time_created }}</em>
            </li>
            <li>
              <strong>Latest revision:</strong> {{ m2m.latest_revision }} /
              <em>{{ revisions[`${m2m.import_id}|${m2m.latest_revision}`]?.r.time_created }}</em>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
