<script setup lang="ts">
import { type PropType, onMounted, ref } from "vue";
import { AcademicItemModel, AcademicItemVariantModel } from "@/plugins/api/spec";
import { API, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import StringVariationsField from "@/components/items-edit/StringVariationsField.vue";
import { StringFieldKeys } from "@/types/items";
import JSONVariantionsField from "@/components/items-edit/JSONVariantionsField.vue";
import type { Revision } from "@/types/imports";
import FoldableVariant from "@/components/items-edit/FoldableVariant.vue";
import { clearString, isString } from "@/util";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

const props = defineProps({
  item: {
    type: Object as PropType<AcademicItemModel>,
    required: true,
  },
  revisions: {
    type: Object as PropType<Record<string, Revision>>,
    required: true,
  },
});

const stringFields: [string, StringFieldKeys][] = [
  ["Title", "title"], // FIXME remember tslug!
  ["Text", "text"], // FIXME remember tslug!
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

const variants = ref<AcademicItemVariantModel[]>([]);

function saveItem() {
  if (!props.item) return;

  API.item
    .updateItemInfoApiItemInfoPut({
      requestBody: {
        item_id: props.item.item_id,
        text: clearString(props.item.text),
        doi: clearString(props.item.doi),
        wos_id: clearString(props.item.wos_id),
        scopus_id: clearString(props.item.scopus_id),
        openalex_id: clearString(props.item.openalex_id),
        s2_id: clearString(props.item.s2_id),
        pubmed_id: clearString(props.item.pubmed_id),
        dimensions_id: clearString(props.item.dimensions_id),
        title: clearString(props.item.title),
        publication_year: isString(props.item.publication_year)
          ? parseInt(clearString(props.item.publication_year as unknown as string) as string) || null
          : props.item.publication_year,
        source: clearString(props.item.source),
        keywords: props.item.keywords,
        authors: props.item.authors,
        meta: props.item.meta,
      },
      xProjectId: currentProjectStore.projectId as string,
    })
    .then(() => {
      EventBus.emit(new ToastEvent("SUCCESS", "Saved item!"));
      if (!props.item) return;
      props.item.time_edited = "Reload for new edit date";
    })
    .catch(toastReject);
}

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
  <div>
    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex flex-row">
          <div class="flex-grow-1">
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
          <div>
            <button @click="saveItem" role="button" class="btn btn-success">Save</button>
          </div>
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
        <JSONVariantionsField
          title="Keywords"
          field="keywords"
          :variants="variants"
          :model="item['keywords']"
          class="mb-3"
        />
        <JSONVariantionsField
          title="Authors"
          field="authors"
          :variants="variants"
          :model="item['authors']"
          class="mb-3"
        />
        <JSONVariantionsField title="Meta" field="meta" :variants="variants" :model="item['meta']" class="mb-3" />
      </div>
    </div>
    <h2>Alternate versions</h2>
    <h6>
      Note, that only distinct values are stored; some fields may be empty as the respective value has been seen
      previously in a variant.
    </h6>
    <FoldableVariant
      v-for="vari in variants"
      :key="vari.item_variant_id"
      :variant="vari"
      :revisions="revisions"
      class="mb-3"
    />
  </div>
</template>

<style scoped></style>
