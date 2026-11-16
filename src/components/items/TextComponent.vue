<template>
  <div>
    <template v-if="!text">
      <p class="text-warning">
        <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
        {{ missingText }}
      </p>
    </template>
    <template v-else>
      <div
        class="text-muted small position-absolute"
        role="button"
        style="top: 0; right: 0"
        @click="iterateColumns"
        tabindex="-1"
      >
        <font-awesome-icon :icon="['fas', 'table-columns']" class="me-2" />
      </div>

      <p class="card-text text-muted" :style="columnStyle" v-html="htmlText" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { marked } from "marked";
import { sanitizeHtml } from "@/util";

defineOptions({ name: "TextComponent" });

const props = defineProps({
  text: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
  html: {
    type: String as PropType<string | null>,
    required: false,
    default: null,
  },
  missingText: {
    type: String,
    required: false,
    default: "[Text missing]",
  },
});

const htmlText = computed(() => {
  // Provided html trumps internal parsing
  if (props.html) return sanitizeHtml(props.html);
  // Return placeholder for missing texts
  if (!props.text) return props.missingText;
  let txt = props.text;
  txt = txt.replaceAll("`", "'");
  // the parser runs synchronously here (marked's async mode is never enabled) and the
  // highlighters return a string; same unchecked assumptions as the original
  txt = marked.parse(txt) as string;
  // returns null for blank/whitespace-only text -> keep the parsed markdown in that case
  txt = (currentProjectStore.highlighters.applyActiveHighlighters(txt) as string | null) ?? txt;
  // item data is user-supplied, so the final html must be sanitized before v-html
  return sanitizeHtml(txt.replaceAll("\n", "<br />"));
});
const columnStyle = computed((): Record<string, string> => {
  return interfaceSettingsStore.itemColumnStyle;
});

function iterateColumns() {
  if (!interfaceSettingsStore.itemDisplay.columns) {
    interfaceSettingsStore.itemDisplay.columns = 0;
  }
  interfaceSettingsStore.itemDisplay.columns += 1;

  if (interfaceSettingsStore.itemDisplay.columns > 4) {
    interfaceSettingsStore.itemDisplay.columns = 1;
  }
}
</script>

<style scoped />
