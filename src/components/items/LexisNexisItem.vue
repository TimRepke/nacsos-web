<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-header d-flex">
      <div style="line-height: 2rem" class="fw-bold me-auto" v-html="htmlTitle" />
      <div class="text-muted" role="button" style="top: 0; right: 0" @click="iterateColumns">
        <font-awesome-icon :icon="['fas', 'table-columns']" class="me-2" />
      </div>
      <div>
        <inline-tool-tip info="Raw data" placement="left">
          <font-awesome-icon :icon="['far', 'circle-question']" class="me-2" @click="showRaw = !showRaw" />
        </inline-tool-tip>
      </div>
    </div>
    <div class="card-body position-relative">
      <div v-if="showRaw" class="border-bottom mb-4">
        <pre>
          {{ JSON.stringify(item, null, 4) }}
        </pre>
      </div>
      <p class="lead">
        {{ item.teaser }}
      </p>
      <p class="text-muted" v-if="item.authors">
        <font-awesome-icon :icon="['fas', 'people-group']" class="me-2" />
        <span v-for="(author, ai) in item.authors" :key="ai">
          <template v-if="ai > 0">,</template>
          {{ author }}
        </span>
      </p>
      <template v-if="!item.text">
        <p class="text-warning">
          <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
          [Text missing]
        </p>
      </template>
      <template v-else>
        <p class="card-text text-muted" :style="columnStyle" v-html="htmlAbstract" />
      </template>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <ul class="list-unstyled" v-if="item.sources">
        <li v-for="source in item.sources" :key="source.item_source_id">
          <div class="small text-muted d-flex flex-nowrap">
            <div class="me-2">
              <font-awesome-icon :icon="['fas', 'bullhorn']" class="me-2" />
            </div>
            <div>
              <div class="d-flex flex-wrap">
                <div class="me-2" v-if="source.name">
                  <strong>{{ source.name }}</strong>
                </div>
              </div>

              <div class="d-flex flex-wrap">
                <div class="flex-nowrap d-flex me-2" v-if="source.published_at">
                  <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-1" />
                  {{ source.published_at }}
                </div>
                <div class="me-2" v-if="source.section">{{ source.section }}</div>
                <div class="fst-italic me-2" v-if="source.content_type">({{ source.content_type }})</div>
              </div>

              <div class="" v-if="source.lexis_id">
                <code>{{ source.lexis_id }}</code>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import type { FullLexisNexisItemModel, HighlighterModel } from "@/plugins/api/api-core";
import { interfaceSettingsStore } from "@/stores";
import { marked } from "marked";

export default defineComponent({
  name: "LexisNexisItem",
  components: { InlineToolTip },
  props: {
    item: {
      type: Object as PropType<FullLexisNexisItemModel>,
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
      showRaw: false,
    };
  },
  computed: {
    htmlAbstract() {
      let txt = this.item.text || "";
      txt = txt.replaceAll("`", "'");
      txt = marked.parse(txt);
      txt = this.applyHighlighters(txt);
      return txt.replaceAll("\n", "<br />");
    },
    htmlTitle() {
      if (this.item.sources && this.item.sources.length > 0) {
        let txt = this.item.sources[0].title || "";
        txt = this.applyHighlighters(txt);
        return txt;
      }
      return '[MISSING]'
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

<style scoped>
/deep/ a {
  text-decoration: none !important;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}

.list-inline-item:not(:last-child):after {
  content: "·";
  margin-left: 0.5rem;
}
</style>
