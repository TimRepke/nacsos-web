<template>
  <div class="text-start">
    <h1>Consolidate/Resolve Annotations</h1>
    <div v-if="dataIsLoaded" class="table-responsive">
      <table class="table">
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
                <BoolLabel :annotation="annotation" :info="columnLabelInfos[key_i]" :users="matrix.users" />
              </template>
              <template v-else-if="columnLabelInfos[key_i].kind === 'single'">
                <ChoiceLabel :annotation="annotation" :info="columnLabelInfos[key_i]" :users="matrix.users" />
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
  AnnotationSchemeModelFlat,
  FlattenedAnnotationSchemeLabel,
} from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import BoolLabel from '@/components/annotations/resolve/BoolLabel.vue';
import ItemModal from '@/components/items/ItemModal.vue';
import InlineToolTip from '@/components/InlineToolTip.vue';
import ChoiceLabel from '@/components/annotations/resolve/ChoiceLabel.vue';

type ResolveData = {
  matrix: AnnotationMatrix | undefined,
  scheme: AnnotationSchemeModelFlat | undefined,
  focusItem: string | undefined,
};

export default {
  name: 'AnnotationConfigResolveView',
  components: { ItemModal, InlineToolTip, BoolLabel, ChoiceLabel },
  data(): ResolveData {
    return {
      matrix: undefined,
      scheme: undefined,
      focusItem: undefined,
    };
  },
  async mounted() {
    this.matrix = (await API.core.annotations.getItemAnnotationMatrixApiAnnotationsConfigResolveGet({
      scopeId: 'b3731e6a-c651-4d15-b957-828508dee5ac',
      xProjectId: currentProjectStore.projectId,
    })).data;
    this.scheme = (await API.core.annotations.getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
      annotationSchemeId: this.matrix.scheme_id,
      flat: true,
    })).data;
  },
  methods: {
    // pass
  },
  computed: {
    dataIsLoaded() {
      return this.matrix !== undefined && this.scheme !== undefined;
    },
    labelInfoMap(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.dataIsLoaded) return {};
      const ret: Record<string, FlattenedAnnotationSchemeLabel> = {};
      for (let run = 0; run < this.scheme.labels.length; run += 1) {
        ret[this.scheme.labels[run].key] = this.scheme.labels[run];
      }
      return ret;
    },
    columnLabelInfos(): FlattenedAnnotationSchemeLabel[] {
      if (!this.dataIsLoaded) return [];
      return this.matrix.labels.map((key: string[][]) => this.labelInfoMap[key[key.length - 1][0]]);
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
