<script setup lang="ts">
import { type AcademicItemVariantJSON } from "@/types/items";
import type { AcademicItemVariantModel } from "@/plugins/api/spec";
import { computed, ref, watch } from "vue";
import { isEmpty } from "@/util";

const props = defineProps<{
  title: string;
  field: keyof AcademicItemVariantJSON;
  variants: AcademicItemVariantModel[];
}>();
const model = defineModel<Record<string, any> | null>("model", { required: true });
const dummyModel = ref<string>(!model.value ? "" : JSON.stringify(model.value, null, 2));
const showVariants = ref<boolean>(false);
const variations = computed<AcademicItemVariantModel[]>(() =>
  (props.variants as AcademicItemVariantModel[]).filter((variant) => !isEmpty(variant[props.field])),
);
const isValid = ref<boolean>(true);

watch(dummyModel, (newValue: string) => {
  // Empty field translated to None
  if (newValue.trim().length === 0) {
    isValid.value = true;
    model.value = null;
  }
  try {
    model.value = JSON.parse(dummyModel.value);
    isValid.value = true;
  } catch {
    isValid.value = false;
  }
});
</script>

<template>
  <div>
    <div class="d-flex flex-row">
      <div class="flex-grow-1">
        <label :for="`variants-${field}`" class="form-label">{{ title }}</label>
      </div>
      <div class="text-end input-group-sm">
        <label v-if="variations.length === 0" class="input-group-text">No variants</label>
        <button v-else class="btn btn-sm btn-outline-secondary" type="button" @click="showVariants = !showVariants">
          {{ showVariants ? "Hide" : "Show" }} {{ variations.length }} variants
        </button>
      </div>
    </div>

    <textarea
      class="form-control"
      rows="6"
      :id="`variants-${field}`"
      v-model="dummyModel"
      :class="{ 'is-valid': isValid, 'is-invalid': !isValid }"
    />
    <div class="invalid-feedback">Invalid JSON.</div>

    <div class="form-text" v-if="showVariants">
      <pre v-for="variant in variations" :key="variant.item_variant_id" class="card"><code>{{
          JSON.stringify(variant[field], null, 2)
        }}</code></pre>
    </div>
  </div>
</template>
