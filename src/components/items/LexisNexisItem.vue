<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-header d-flex">
      <div style="line-height: 2rem" class="fw-bold me-auto" v-html="htmlTitle" />
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
      <p class="lead" v-if="htmlTeaser" v-html="htmlTeaser" />
      <p class="text-muted" v-if="item.authors">
        <font-awesome-icon :icon="['fas', 'people-group']" class="me-2" />
        <span v-for="(author, ai) in item.authors" :key="ai">
          <template v-if="ai > 0">,</template>
          {{ author }}
        </span>
      </p>
      <TextComponent :text="item.text" />
    </div>
    <div class="card-footer d-flex justify-content-between">
      <ul class="list-unstyled" v-if="item.sources">
        <li v-for="source in item.sources" :key="source.item_source_id as string">
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
import type { FullLexisNexisItemModel } from "@/plugins/api/types";
import TextComponent from "@/components/items/TextComponent.vue";
import { currentProjectStore } from "@/stores";

export default defineComponent({
  name: "LexisNexisItem",
  components: { TextComponent, InlineToolTip },
  props: {
    item: {
      type: Object as PropType<FullLexisNexisItemModel>,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      showRaw: false,
    };
  },
  computed: {
    htmlTitle() {
      return (
        currentProjectStore.projectHighlighters.applyActiveHighlighters(this.item.sources?.[0]?.title) ?? "[MISSING]"
      );
    },
    htmlTeaser(): string | null {
      return currentProjectStore.projectHighlighters.applyActiveHighlighters(this.item.teaser);
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
