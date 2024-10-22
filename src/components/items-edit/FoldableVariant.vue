<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import type { AcademicItemVariantModel } from "@/plugins/api/spec";
import { Revision } from "@/types/imports";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
  variant: {
    type: Object as PropType<AcademicItemVariantModel>,
    required: true,
  },
  revisions: {
    type: Object as PropType<Record<string, Revision>>,
    required: true,
  },
});
const visible = ref<boolean>(false);
const info = computed(
  () => props.revisions?.[`${props.variant.import_id}|${props.variant.import_revision}`] ?? { i: {}, r: {} },
);
</script>

<template>
  <div class="card">
    <div class="card-header clickable-icon small" @click="visible = !visible">
      <font-awesome-icon :icon="visible ? 'minus' : 'plus'" />
      {{ info.i.name }} (rev. {{ info.r.import_revision_counter }} / {{ info.r.time_created }})
    </div>
    <div v-if="visible" class="card-body">
      <ul>
        <li v-for="(v, k) in variant" :key="k">
          <strong>{{ k }}:</strong>&nbsp;{{ v }}
        </li>
      </ul>
    </div>
  </div>
</template>
