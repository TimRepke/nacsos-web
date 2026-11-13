<template>
  <div>
    <textarea
      v-if="notNone(proposalRow)"
      class="form-control"
      :id="`txt-${label.path_key}-${itemId}`"
      :aria-label="label.name"
      rows="3"
      :value="val"
      @change="setBotAnnotation($event.target?.value)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { PropType } from "vue";
import type { FlatLabel, ResolutionCell, BotAnnotationModel } from "@/plugins/api/types";
import { is, isNone, notNone } from "@/util";

defineOptions({ name: "StringLabel" });

const emit = defineEmits(["botAnnotationChanged"]);

const props = defineProps({
  itemId: { type: String, required: true },
  label: {
    type: Object as PropType<FlatLabel>,
    required: true,
  },
  proposalRow: {
    type: Object as PropType<Record<string, ResolutionCell>>,
    required: true,
  },
});

// set to true when bot annotation was manipulated
const changed = ref(false);

const val = computed<string | undefined>(() => {
  const { resolution } = props.proposalRow[props.label.path_key];
  if (isNone(resolution) || isNone(resolution.value_str)) return undefined;
  return resolution.value_str;
});

function setBotAnnotation(value: string | undefined | null) {
  const { resolution } = props.proposalRow[props.label.path_key];
  if (is<BotAnnotationModel>(resolution)) {
    // Do not store empty/whitespace-only text: that would create an annotation without content.
    resolution.value_str = value && value.trim().length > 0 ? value : undefined;
    emit("botAnnotationChanged", resolution);
    changed.value = true;
  }
}
</script>
