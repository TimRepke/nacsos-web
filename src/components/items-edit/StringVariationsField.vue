<script setup lang="ts">
import { type Change, diffChars } from "diff";
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { AcademicItemVariantModel } from "@/plugins/api/spec";
import type { AcademicItemVariantStrings } from "@/types/items";
import { isEmpty } from "@/util";

const props = defineProps<{
  title: string;
  field: keyof AcademicItemVariantStrings;
  variants: AcademicItemVariantModel[];
}>();
const model = defineModel<string | number | null>("model", { required: true });
const showVariants = ref<boolean>(false);
const showDiff = ref<boolean>(false);
const urlPrefix: string | null = {
  doi: "https://dx.doi.org/",
  openalex_id: "https://openalex.org/works/",
  pubmed_id: "https://pubmed.ncbi.nlm.nih.gov/",
  title: null,
  publication_year: null,
  source: null,
  wos_id: null,
  scopus_id: null,
  s2_id: null,
  dimensions_id: null,
  text: null,
}[props.field];

const variations = computed<(AcademicItemVariantModel & { diff: Change[] })[]>(() =>
  (props.variants as AcademicItemVariantModel[])
    .filter((variant) => !isEmpty(variant[props.field]))
    .map((variant) => ({ ...variant, diff: diffChars(model.value as string, variant[props.field] as string) })),
);
</script>

<template>
  <div>
    <label :for="`variants-${field}`" class="form-label">{{ title }}</label>
    <div class="input-group input-group-sm">
      <textarea v-if="field === 'text'" class="form-control" rows="6" :id="`variants-${field}`" v-model="model" />
      <input v-else :id="`variants-${field}`" class="form-control form-control-sm" type="text" v-model="model" />

      <label v-if="variations.length === 0" class="input-group-text">No variants</label>
      <button v-else class="btn btn-sm btn-outline-secondary" type="button" @click="showVariants = !showVariants">
        {{ showVariants ? "Hide" : "Show" }} {{ variations.length }} variants
      </button>
    </div>

    <div class="form-text" v-if="showVariants">
      <div class="clickable-icon text-end" @click="showDiff = !showDiff">
        <font-awesome-icon icon="timeline" class="me-1" />
        Show/hide diff
      </div>
      <ul class="list-unstyled">
        <li v-for="variant in variations" :key="variant.item_variant_id" class="ms-2">
          <font-awesome-icon icon="clipboard" class="clickable-icon me-1" @click="model = variant[field]" />
          <template v-if="showDiff">
            <span
              v-for="(pt, i) in variant.diff"
              :key="i"
              :style="{
                backgroundColor: pt.added ? '#CCE2CB' : pt.removed ? '#FFC8A2' : null,
                textDecoration: pt.removed ? 'line-through' : null,
              }"
            >
              {{ pt.value }}
            </span>
          </template>
          <a v-else-if="urlPrefix" :href="`${urlPrefix}${variant[field]}`" target="_blank">
            <font-awesome-icon icon="up-right-from-square" class="me-1 ms-2" />
            {{ variant[field] }}
          </a>
          <span v-else>
            {{ variant[field] }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
