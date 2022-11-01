<template>
  <div class="text-start">
    <h1>Consolidate/Resolve Annotations</h1>
    <div v-if="dataIsLoaded" class="table-responsive">
      <table class="table" style="width: calc(100% - 1rem)">
        <thead>
          <tr>
            <th />
            <th :colspan="matrix.labels.length">Label</th>
          </tr>
          <tr>
            <th>Item</th>
            <th v-for="key in matrix.labels" :key="key">
              <span v-for="skey in key" :key="skey[0]" class="label-pill me-1">
                <span>{{ skey[0] }}</span>
                <span>{{ skey[1] }}</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(annotations, itemId) in matrix.matrix" :key="itemId">
            <td>
              <InlineToolTip :info="`ID: ${itemId}`" placement="right" size="medium">
                <font-awesome-icon
                  role="button"
                  class="text-muted me-1"
                  :icon="['fas', 'up-right-from-square']"
                  @click="this.focusItem = itemId" />
              </InlineToolTip>
            </td>
            <td v-for="(annotation, key_i) in annotations" :key="key_i">
              <template v-if="columnLabelInfos[key_i].kind === 'bool'">
                <BoolLabel
                  :user-annotations="annotation"
                  :bot-annotation="botAnnotationMap[itemId][key_i]"
                  :info="columnLabelInfos[key_i]"
                  :users="matrix.users" />
              </template>
              <template v-else-if="columnLabelInfos[key_i].kind === 'single'">
                <ChoiceLabel
                  :user-annotations="annotation"
                  :bot-annotation="botAnnotationMap[itemId][key_i]"
                  :info="columnLabelInfos[key_i]"
                  :users="matrix.users"
                  :choice-lookup="choiceLookups[columnLabelInfos[key_i].key]" />
              </template>
              <template v-else>
                {{ annotation }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ItemModal :item-id="focusItem" @dismissed="focusItem = undefined" />
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import {
  AnnotationMatrix,
  AnnotationSchemeLabelChoiceFlat,
  AnnotationSchemeModelFlat,
  FlattenedAnnotationSchemeLabel,
  BotMetaResolve,
  BotAnnotationModel,
  AnnotationFilters,
} from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import BoolLabel from '@/components/annotations/resolve/BoolLabel.vue';
import ItemModal from '@/components/items/ItemModal.vue';
import InlineToolTip from '@/components/InlineToolTip.vue';
import ChoiceLabel from '@/components/annotations/resolve/ChoiceLabel.vue';

type ResolveData = {
  botAnnotationMetaId: string | undefined,
  algorithm: BotMetaResolve.algorithm | undefined,
  filters: AnnotationFilters,
  matrix: AnnotationMatrix | undefined,
  // currently relevant annotation_scheme_id (e.g. if part of matrix or selected during setup)
  schemeId: string | undefined,
  // flattened labels for schemeId (lazy-loaded via watch)
  scheme: AnnotationSchemeModelFlat | undefined,
  // id of item in focus (to be opened in modal)
  focusItem: string | undefined,
  annotations: BotAnnotationModel[] | undefined,
};

export default {
  name: 'AnnotationConfigResolveView',
  components: { ItemModal, InlineToolTip, BoolLabel, ChoiceLabel },
  data(): ResolveData {
    return {
      botAnnotationMetaId: this.$route.params.bot_annotation_meta_id,
      filters: {
        scope_id: 'b3731e6a-c651-4d15-b957-828508dee5ac', // FIXME remove after testing
      } as AnnotationFilters,
      algorithm: BotMetaResolve.algorithm.MAJORITY, // FIXME remove after testing
      // algorithm: undefined,
      schemeId: undefined,
      matrix: undefined,
      scheme: undefined,
      focusItem: undefined,
      annotations: undefined,
    };
  },

  async mounted() {
    if (this.botAnnotationMetaId) {
      API.core.annotations.getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdGet({
        botAnnotationMetaId: this.botAnnotationMetaId,
        xProjectId: currentProjectStore.projectId,
      }).then((response) => {
        const { data } = response;
        this.filters = data.meta.filters;
        this.algorithm = data.meta.algorithm;
        this.schemeId = data.annotation_scheme_id;
        this.matrix = data.meta.matrix;
        this.annotations = data.saved;
      });
    } else {
      // FIXME: remove after testing!
      this.fetchProposal();
    }
  },
  watch: {
    schemeId(newSchemeId: string | undefined | null) {
      if (newSchemeId !== undefined && newSchemeId !== null) {
        API.core.annotations.getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
          annotationSchemeId: newSchemeId,
          flat: true,
        }).then((response) => {
          this.scheme = response.data;
        });
        this.fetchProposal();
      }
    },
    filters: {
      handler() {
        this.fetchProposal();
      },
      deep: true,
    },
    algorithm() {
      this.fetchProposal();
    },
  },
  methods: {
    fetchProposal() {
      API.core.annotations.getItemAnnotationMatrixApiAnnotationsConfigResolveGet({
        strategy: this.algorithm,
        xProjectId: currentProjectStore.projectId,
        schemeId: this.filters.scheme_id,
        scopeId: (!this.filters.scope_id) ? undefined : [this.filters.scope_id],
        userId: (!this.filters.user_id) ? undefined : [this.filters.user_id],
        key: (!this.filters.key) ? undefined : [this.filters.key],
        repeat: (!this.filters.repeat) ? undefined : [this.filters.repeat],
      }).then((response) => {
        const { data } = response;
        this.schemeId = data.matrix.scheme_id;
        this.matrix = data.matrix;
        this.annotations = data.proposal;
      });
    },
  },
  computed: {
    dataIsLoaded() {
      return this.matrix !== undefined && this.scheme !== undefined;
    },
    labelInfoMap(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.dataIsLoaded) return {};
      return Object.fromEntries(this.scheme.labels.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]));
    },
    columnLabelInfos(): FlattenedAnnotationSchemeLabel[] {
      if (!this.dataIsLoaded) return [];
      return this.matrix.labels.map((key: string[][]) => this.labelInfoMap[key[key.length - 1][0]]);
    },
    choiceLookups(): Record<string, Record<number, AnnotationSchemeLabelChoiceFlat>> {
      if (!this.dataIsLoaded) return {};
      return Object.fromEntries(this.scheme.labels.map((label: FlattenedAnnotationSchemeLabel) => {
        if (!label.choices) return [label.key, undefined];
        return [label.key, Object.fromEntries(label.choices.map((choice: AnnotationSchemeLabelChoiceFlat) => [choice.value, choice]))];
      }));
    },
    lab2col(): Record<string, number> {
      if (!this.dataIsLoaded) return {};
      return Object.fromEntries(this.matrix.labels.map((key: Array<[string, number]>, ind: number) => [key[key.length - 1].join('-'), ind]));
    },
    botAnnotationMap(): Record<string, Array<BotAnnotationModel | undefined>> {
      if (!this.dataIsLoaded || !this.annotations) return {};
      const ret: Record<string, Array<BotAnnotationModel | undefined>> = {};
      this.annotations.forEach((botAnnotation: BotAnnotationModel) => {
        if (!(botAnnotation.item_id in ret)) ret[botAnnotation.item_id] = [];
        ret[botAnnotation.item_id][this.lab2col[`${botAnnotation.key}-${botAnnotation.repeat}`]] = botAnnotation;
      });
      return ret;
    },
  },
};
</script>

<style scoped>

.label-pill span {
  border-radius: var(--bs-border-radius-pill);
  border: 1px solid var(--bs-gray-500);
  font-weight: normal;
  /*font-size: var(--bs-badge-font-size);*/
  font-size: 0.75em;
  /*padding:  var(--bs-badge-padding-y) var(--bs-badge-padding-x);*/
  padding: .35em .65em;
}

.label-pill span:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.label-pill span:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
  background-color: var(--bs-gray-300);
}
</style>
