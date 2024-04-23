<template>
  <div>
    <template v-if="!text">
      <p class="text-warning">
        <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
        {{ missingText }}
      </p>
    </template>
    <template v-else>
      <p class="card-text text-muted" :style="columnStyle" v-html="htmlText" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { HighlighterModel } from "@/plugins/api/types";
import { interfaceSettingsStore } from "@/stores";
import { marked } from "marked";

export default defineComponent({
  name: "TextComponent",
  props: {
    text: {
      type: String,
      required: false,
      default: null,
    },
    html: {
      type: String,
      required: false,
      default: null,
    },
    highlighters: {
      type: Object as PropType<Array<HighlighterModel>>,
      required: false,
      default: undefined,
    },
    missingText: {
      type: String,
      required: false,
      default: "[Text missing]",
    },
  },
  data() {
    return {
      showRaw: false,
    };
  },
  computed: {
    htmlText() {
      if (this.html) return this.html;

      let txt = this.text || "";
      txt = txt.replaceAll("`", "'");
      txt = marked.parse(txt);
      txt = this.applyHighlighters(txt);
      return txt.replaceAll("\n", "<br />");
    },
    columnStyle(): Record<string, string> {
      return interfaceSettingsStore.itemColumnStyle;
    },
  },
  methods: {
    applyHighlighters(txt: string) {
      if (this.highlighters) {
        this.highlighters.forEach((highlighter: HighlighterModel) => {
          try {
            const regex = new RegExp(highlighter.keywords.join("|"), "gi");
            txt = txt.replaceAll(regex, `<span style="${highlighter.style}">$&</span>`);
          } catch (e) {
            console.warn("Ignoring illegal regex!");
            console.error(e);
          }
        });
      }
      return txt;
    },
    iterateColumns() {
      if (!interfaceSettingsStore.itemDisplay.columns) {
        interfaceSettingsStore.itemDisplay.columns = 0;
      }
      interfaceSettingsStore.itemDisplay.columns += 1;

      if (interfaceSettingsStore.itemDisplay.columns > 4) {
        interfaceSettingsStore.itemDisplay.columns = 1;
      }
    },
  },
});
</script>

<style scoped />
