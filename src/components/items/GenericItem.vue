<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-body">
      <p class="card-text" v-html="htmlText" />
    </div>
    <div class="card-footer d-flex justify-content-between small text-muted" v-if="item.meta">
      <div class="position-absolute end-0">
        <font-awesome-icon :icon="['fas', 'info-circle']" class="me-2" @click="showAll = !showAll" />
      </div>
      <ul class="list-unstyled">
        <template v-for="(value, key) in item.meta" :key="key">
          <li v-if="!key.startsWith('_')">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </template>
        <template v-if="showAll">
          <div>
            <strong>Item ID: </strong>
            <code>
              {{ item.item_id }}
            </code>
          </div>
          <template v-for="(value, key) in item.meta" :key="key">
            <li v-if="key.startsWith('_')" class="text-muted small">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { marked } from "marked";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { HighlighterModel } from "@/plugins/api/api-core";
import type { BaseItem as BaseItemModel } from "@/types/items.d";

export default defineComponent({
  name: "GenericItem",
  props: {
    item: {
      type: Object as PropType<BaseItemModel>,
      required: true,
      default: null,
    },
    highlighters: {
      type: Object as PropType<Array<HighlighterModel>>,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      showAll: false,
    };
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
  },
  computed: {
    htmlText() {
      let txt = this.item.text || "";
      txt = txt.replaceAll("`", "'");
      txt = marked.parse(txt);
      txt = this.applyHighlighters(txt);
      return txt.replaceAll("\n", "<br />");
    },
  },
});
</script>

<style scoped></style>