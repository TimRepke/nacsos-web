<script setup lang="ts">
import { type PropType, onMounted, ref } from "vue";
import type { AcademicItemModel, AcademicItemVariantModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import StringVariationsField from "@/components/items-edit/StringVariationsField.vue";

const props = defineProps({
  item: {
    type: Object as PropType<AcademicItemModel>,
    required: true,
  },
});

// import_revision
// import_id
// item_variant_id
// item_id
const stringFields = [
  ["Title", "title"], // FIXME remember tslug!
  ["Publication year", "publication_year"], //FIXME: remember parsing
  ["Source (e.g. journal)", "source"],
  ["DOI", "doi"],
  ["WoS ID", "wos_id"],
  ["Scopus ID", "scopus_id"],
  ["OpenAlex ID", "openalex_id"],
  ["SemanticScholar ID", "s2_id"],
  ["Pubmed ID", "pubmed_id"],
  ["Dimensions ID", "dimensions_id"],
];
// text
// keywords
// authors
// meta

const variants = ref<AcademicItemVariantModel[]>([]);
onMounted(async () => {
  variants.value = (
    await API.item.getItemVariantsApiItemVariantsItemIdGet({
      itemId: props.item?.item_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
  ).data;
});
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div>
        <ul class="list-unstyled">
          <li>
            <strong>Item ID:</strong>&nbsp;<code>{{ item.item_id }}</code>
          </li>
          <li>
            <strong>Last edited:</strong>&nbsp;
            <span v-if="item.time_edited">{{ item.time_edited }}</span>
            <em v-else>Never</em>
          </li>
        </ul>
      </div>
      <StringVariationsField
        v-for="[sfName, sfKey] in stringFields"
        :key="sfKey"
        :title="sfName"
        :field="sfKey"
        v-model:model="item[sfKey]"
        :variants="variants"
        class="mb-3"
      />
    </div>
  </div>
</template>

<style scoped></style>
