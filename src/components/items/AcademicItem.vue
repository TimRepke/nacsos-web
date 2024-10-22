<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-header d-flex">
      <div style="line-height: 2rem" class="fw-bold" v-html="htmlTitle" />
      <div class="ms-auto">
        <inline-tool-tip info="DOI" placement="left" v-show="!!item.doi">
          <a
            :href="`https://dx.doi.org/${item.doi || ''}`"
            class="float-end link-secondary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DOI"
          >
            <font-awesome-icon :icon="['fas', 'file-lines']" class="me-2" />
          </a>
        </inline-tool-tip>
      </div>
      <div>
        <inline-tool-tip info="OpenAlex" placement="left" v-show="!!item.openalex_id">
          <a
            :href="`https://openalex.org/works/${item.openalex_id}`"
            class="float-end link-secondary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="OpenAlex"
          >
            <font-awesome-icon :icon="['fas', 'database']" class="me-2" />
          </a>
        </inline-tool-tip>
      </div>
      <div>
        <inline-tool-tip info="Raw data" placement="left">
          <font-awesome-icon :icon="['far', 'circle-question']" class="me-2" @click="showRaw = !showRaw" />
        </inline-tool-tip>
      </div>
      <div>
        <router-link :to="{ name: 'project-dataset-item', params: { item_id: item.item_id } }">
          <font-awesome-icon icon="file-signature" />
        </router-link>
      </div>
    </div>
    <div class="card-body position-relative">
      <div v-if="showRaw">
        <pre>
          {{ JSON.stringify(item, null, 4) }}
        </pre>
      </div>
      <TextComponent :text="item.text" missing-text="[Abstract missing]" />
    </div>
    <div class="card-footer d-flex justify-content-between">
      <div class="d-flex flex-wrap small text-muted">
        <div v-if="item.publication_year" class="flex-nowrap d-flex me-4">
          <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-2" />
          {{ item.publication_year }}
        </div>
        <div v-if="item.authors" class="flex-nowrap d-flex me-4">
          <font-awesome-icon :icon="['fas', 'people-group']" class="me-2" />
          <ul class="list-inline mb-0">
            <li v-for="author in item.authors" :key="author.name" class="list-inline-item">
              <inline-tool-tip :info="authorInstitutions(author)">
                <template v-if="author.orcid">
                  <a :href="`https://orcid.org/${author.orcid}`" target="_blank" rel="noopener noreferrer">
                    {{ author.name }}
                  </a>
                </template>
                <template v-else>
                  {{ author.name }}
                </template>
              </inline-tool-tip>
            </li>
          </ul>
        </div>
        <div v-if="item.keywords" class="d-flex me-4">
          <font-awesome-icon :icon="['fas', 'tags']" class="me-2" />
          {{ item.keywords.join(" | ") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import type { AcademicAuthorModel, AcademicItemModel, AffiliationModel } from "@/plugins/api/types";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import TextComponent from "@/components/items/TextComponent.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  name: "AcademicItem",
  components: { FontAwesomeIcon, TextComponent, InlineToolTip },
  props: {
    item: {
      type: Object as PropType<AcademicItemModel>,
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
      return currentProjectStore.projectHighlighters.applyActiveHighlighters(this.item.title) ?? "[Missing title]";
    },
    columnStyle(): Record<string, string> {
      return interfaceSettingsStore.itemColumnStyle;
    },
  },
  methods: {
    authorInstitutions(author: AcademicAuthorModel): string | undefined {
      return author.affiliations
        ?.map((affiliation: AffiliationModel) => `${affiliation.name}, ${affiliation.country}`)
        .join(";");
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
