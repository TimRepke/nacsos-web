<template>
  <div class="text-start">
    <h1>Consolidate/Resolve Annotations</h1>
    <button
      @click="save"
      type="button"
      class="btn btn-success">Save
    </button>
    <div v-if="!!collection && !!collection.annotations" class="table-responsive">
      <table class="table" style="width: calc(100% - 1rem)">
        <thead>
          <tr>
            <th>Item</th>
            <th v-for="label in collection.labels" :key="label">
              <span v-for="skey in label" :key="skey.key" class="nacsos-tooltip ms-2 label-pill me-1">
                <span>{{ skey.key }}</span>
                <span>{{ skey.repeat }}</span>
                <div
                  class="nacsos-tooltiptext popover bs-popover-auto fade show bg-light p-0"
                  role="tooltip"
                  data-popper-placement="bottom"
                  style="position: absolute; inset: 0 auto auto 0; margin: 0; transform: translateY(2rem);">
                  <div
                    class="popover-arrow"
                    style="position: absolute; left: 0; transform: translateX(30px);" />
                  <h3 class="popover-header text-dark">{{ schemeLookup[skey.key].name }}</h3>
                  <div class="popover-body">
                    <template v-if="schemeLookup[skey.key].choices">
                      <ul class="list-unstyled">
                        <li v-for="choice in schemeLookup[skey.key].choices" :key="choice.value">
                          <strong>{{ choice.value }}:</strong> {{ choice.name }}
                        </li>
                      </ul>
                    </template>
                    <template v-else>
                      {{ schemeLookup[skey.key].kind }}
                    </template>
                  </div>
                </div>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemId in Object.keys(collection.annotations)" :key="itemId">
            <td>
              <InlineToolTip :info="`ID: ${itemId}`" placement="right" size="medium">
                <font-awesome-icon
                  role="button"
                  class="text-muted me-1"
                  :icon="['fas', 'up-right-from-square']"
                  @click="this.focusItem = itemId" />
              </InlineToolTip>
            </td>
            <td v-for="[label, strLabel] in labels" :key="strLabel">
              <template v-if="schemeLookup[label[0].key]?.kind === 'bool'">
                <BoolLabel
                  :user-annotations="matrix[itemId][strLabel]?.users"
                  :bot-annotation="matrix[itemId][strLabel]?.bot"
                  :info="schemeLookup[label[0].key]"
                  :users="userLookup"
                  @bot-annotation-changed="handleChangedBotAnnotation" />
              </template>
              <template v-else-if="schemeLookup[label[0].key]?.kind === 'single'">
                <ChoiceLabel
                  :user-annotations="matrix[itemId][strLabel]?.users"
                  :bot-annotation="matrix[itemId][strLabel]?.bot"
                  :info="schemeLookup[label[0].key]"
                  :users="userLookup"
                  @bot-annotation-changed="handleChangedBotAnnotation" />
              </template>
              <template v-else>
                Unhandled "{{ schemeLookup[label[0].key]?.kind }}"
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
  AnnotationCollection,
  FlattenedAnnotationSchemeLabel,
  BotAnnotationModel,
  AnnotationFilters,
  BotMetaResolve,
  AnnotationSchemeModel, UserModel, Label, AnnotationModel,
} from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import BoolLabel from '@/components/annotations/resolve/BoolLabel.vue';
import ItemModal from '@/components/items/ItemModal.vue';
import InlineToolTip from '@/components/InlineToolTip.vue';
import ChoiceLabel from '@/components/annotations/resolve/ChoiceLabel.vue';
import { ToastEvent } from '@/plugins/events/events/toast';
import { EventBus } from '@/plugins/events';

type LookupMatrix = Record<string, Record<string, Partial<{ users: AnnotationModel[], bot: BotAnnotationModel }>>>;

type ResolveData = {
  botAnnotationMetaId: string | undefined,
  algorithm: BotMetaResolve.algorithm,
  ignoreHierarchy: boolean;
  ignoreOrder: boolean;
  filters: AnnotationFilters,
  schemeFlat: FlattenedAnnotationSchemeLabel[],
  collection: AnnotationCollection | undefined,
  botAnnotations: Record<string, BotAnnotationModel[]>,
  // id of item in focus (to be opened in modal)
  focusItem: string | undefined,
  // only used for setup (empty when botAnnotationMetaId not None)
  projectAnnotationSchemes: AnnotationSchemeModel[],
};

export default {
  name: 'AnnotationConfigResolveView',
  components: { ItemModal, InlineToolTip, BoolLabel, ChoiceLabel },
  data(): ResolveData {
    return {
      botAnnotationMetaId: this.$route.params.bot_annotation_meta_id,
      filters: {
        scheme_id: '98545fb3-3ed3-48b2-9748-a24015244be0', // FIXME remove after testing
        scope_id: 'b3731e6a-c651-4d15-b957-828508dee5ac', // FIXME remove after testing
      } as AnnotationFilters,
      algorithm: BotMetaResolve.algorithm.MAJORITY,
      ignoreHierarchy: false,
      ignoreOrder: false,
      schemeFlat: [],
      collection: undefined as AnnotationCollection | undefined,
      botAnnotations: {},
      focusItem: undefined as string | undefined,
      projectAnnotationSchemes: [],
    };
  },

  async mounted() {
    if (this.botAnnotationMetaId) {
      API.core.annotations.getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdGet({
        botAnnotationMetaId: this.botAnnotationMetaId,
        xProjectId: currentProjectStore.projectId,
      }).then((response) => {
        // TODO
        const { data } = response;
        console.log(data);
        // this.filters = data.meta.filters;
        // this.algorithm = data.meta.algorithm;
        // this.annotations = data.saved;
      });
    } else {
      this.fetchProjectSchemas();
      this.fetchProposal(); // FIXME: remove after testing!
    }
  },
  methods: {
    fetchProposal() {
      API.core.annotations.getResolvedAnnotationsApiAnnotationsConfigResolveGet({
        strategy: this.algorithm,
        xProjectId: currentProjectStore.projectId,
        schemeId: this.filters.scheme_id,
        scopeId: (!this.filters.scope_id) ? undefined : [this.filters.scope_id],
        userId: (!this.filters.user_id) ? undefined : [this.filters.user_id],
        key: (!this.filters.key) ? undefined : [this.filters.key],
        repeat: (!this.filters.repeat) ? undefined : [this.filters.repeat],
        ignoreHierarchy: this.ignoreHierarchy,
        ignoreOrder: this.ignoreOrder,
      }).then((response) => {
        const { data } = response;
        this.collection = data.collection;
        this.schemeFlat = data.scheme_flat;
        this.botAnnotations = data.proposal;
      });
    },
    fetchProjectSchemas() {
      API.core.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
        projectId: currentProjectStore.projectId,
        xProjectId: currentProjectStore.projectId,
      }).then((response) => {
        const { data } = response;
        this.projectAnnotationSchemes = data;
      });
    },
    handleChangedBotAnnotation(updatedBotAnnotation: BotAnnotationModel) {
      console.log(updatedBotAnnotation);
      console.log('asd');
    },
    save() {
      EventBus.emit(new ToastEvent('WARN', 'Computer says no.'));
    },
    label2string(label: Label[]) {
      return label.map((label_: Label) => `${label_.key}:${label_.repeat}`).join('-');
    },
  },
  computed: {
    userLookup(): Record<string, UserModel> {
      if (!this.collection || !this.collection.annotators) {
        return {};
      }
      return Object.fromEntries(this.collection.annotators.map((user: UserModel) => [user.user_id, user]));
    },
    labels() {
      if (!this.collection || !this.collection.labels) {
        return [];
      }
      return this.collection.labels.map((label: Label[]) => [label, this.label2string(label)]);
    },
    schemeLookup(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.schemeFlat) return {};
      return Object.fromEntries(this.schemeFlat.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]));
    },
    matrix(): LookupMatrix {
      if (!this.collection || !this.collection.annotations) {
        return {};
      }
      const matrix: LookupMatrix = {};
      Object.entries(this.collection.annotations).forEach((entry) => {
        const [itemId, groupedAnnotations] = entry as [string, Array<[Label[], AnnotationModel[]]>];
        if (!matrix[itemId]) matrix[itemId] = {};
        groupedAnnotations.forEach(([path, annotations]) => {
          matrix[itemId][this.label2string(path)] = { users: annotations };
        });
      });
      if (this.botAnnotations) {
        Object.entries(this.botAnnotations).forEach((entry) => {
          const [itemId, botAnnotationEntry] = entry as [string, Array<[Label[], BotAnnotationModel]>];
          botAnnotationEntry.forEach(([path, botAnnotation]) => {
            const strPath = this.label2string(path);
            if (!matrix[itemId]) matrix[itemId] = {};
            if (!matrix[itemId][strPath]) matrix[itemId][strPath] = { bot: botAnnotation };
            else matrix[itemId][strPath].bot = botAnnotation;
          });
        });
      }
      return matrix;
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

.label-pill span:last-of-type {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0;
  background-color: var(--bs-gray-300);
}
</style>
