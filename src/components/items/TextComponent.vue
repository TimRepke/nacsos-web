<template>
  <div>
    <template v-if="!text">
      <p class="text-warning">
        <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
        {{ missingText }}
      </p>
    </template>
    <template v-else>
      <div class="text-muted small position-absolute" role="button" style="top: 0; right: 0" @click="iterateColumns">
        <font-awesome-icon :icon="['fas', 'table-columns']" class="me-2" />
      </div>

      <p class="card-text text-muted" :style="columnStyle" v-html="htmlText" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
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
      // Provided html trumps internal parsing
      if (this.html) return this.html;
      // Return placeholder for missing texts
      if (!this.text) return this.missingText;
      let txt = this.text;
      txt = txt.replaceAll("`", "'");
      txt = marked.parse(txt);
      txt = currentProjectStore.projectHighlighters.applyActiveHighlighters(txt);
      return txt.replaceAll("\n", "<br />");
    },
    columnStyle(): Record<string, string> {
      return interfaceSettingsStore.itemColumnStyle;
    },
  },
  methods: {
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
