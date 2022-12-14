<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-header d-flex">
      <div style="line-height: 2rem">
        {{ item.title }}
      </div>
      <div class="ms-auto">
        <inline-tool-tip info="DOI" placement="left">
          <a
            :href="`https://dx.doi.org/${item.doi || ''}`"
            class="float-end link-secondary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DOI">
            <font-awesome-icon :icon="['fas', 'file-lines']" class="me-2" />
          </a>
        </inline-tool-tip>
      </div>
      <div>
        <inline-tool-tip info="Raw data" placement="left">
          <font-awesome-icon :icon="['far', 'circle-question']" class="me-2" @click="showRaw = !showRaw" />
        </inline-tool-tip>
      </div>
    </div>
    <div class="card-body">
      <div v-if="showRaw">
        <pre>
          {{ JSON.stringify(item, null, 4) }}
        </pre>
      </div>
      <div class="d-flex small text-muted">
        <div v-if="item.publication_year" class="flex-nowrap d-flex me-4">
          <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-2" />
          {{ item.publication_year }}
        </div>
        <div v-if="item.authors" class="flex-nowrap d-flex me-4">
          <font-awesome-icon :icon="['fas', 'people-group']" class="me-2" />
          <ul class="list-inline">
            <li v-for="author in item.authors" :key="author.name" class="list-inline-item">
              <inline-tool-tip :info="authorInstitutions(author)">
                <template v-if="author.orcid">
                  <a
                    :href="`https://orcid.org/${author.orcid}`"
                    target="_blank"
                    rel="noopener noreferrer">
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
      </div>
      <template v-if="!item.text">
        <p class="text-warning">
          <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
          [Abstract missing]
        </p>
      </template>
      <template v-else>
        <p class="card-text text-muted" v-html="htmlAbstract" /> <!-- style="font-family: serif" -->
      </template>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <small v-if="item.keywords" class="text-muted">
        <font-awesome-icon :icon="['fas', 'tags']" class="me-2" />
        {{ item.keywords.join(' | ') }}
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { AcademicAuthorModel, AcademicItemModel, AffiliationModel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';

export default {
  name: 'AcademicItem',
  components: { InlineToolTip },
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
    htmlAbstract() {
      return (this.item.text || '').replaceAll('\n', '<br />');
    },
  },
  methods: {
    authorInstitutions(author: AcademicAuthorModel): string | undefined {
      return author.affiliations?.map(
        (affiliation: AffiliationModel) => `${affiliation.name}, ${affiliation.country}`,
      ).join(';');
    },
  },
};
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
</style>
