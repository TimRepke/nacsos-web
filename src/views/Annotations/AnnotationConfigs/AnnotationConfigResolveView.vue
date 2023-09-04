<template>
  <div>
    <div class="row">
      <h1>Resolve Annotations</h1>
    </div>
    <div class="row mx-auto">
      <div class="accordion">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#resolve-config"
              aria-expanded="true"
              aria-controls="resolve-config">
              Annotation Export Configuration
            </button>
          </h2>
          <div
            id="resolve-config"
            class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="row">
                <div class="col">
                  <div class="mb-3">
                    <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="resolve-name" v-model="name" placeholder="Name" />
                      <label for="resolve-name">Descriptive name for this annotation export</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row gy-5">
                <div class="col border-end">
                  <div class="mb-3">
                    <label for="schema-selector" class="form-label">Annotation Scheme</label>
                    <select
                      :disabled="!isNew"
                      id="schema-selector"
                      class="form-select"
                      aria-label="Schema selector"
                      v-model="filters.scheme_id">
                      <option :value="undefined" disabled>Please choose...</option>
                      <option
                        v-for="scheme in projectAnnotationSchemes"
                        :key="scheme.annotation_scheme_id"
                        :value="scheme.annotation_scheme_id">
                        {{ scheme.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="schemeFlat.length > 0" class="mb-3 border-bottom">
                    <div class="form-label">Scheme labels to resolve</div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="label in schemeFlat" :key="label.key">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`schema-label-selector-${label.key}`"
                          :value="label.key"
                          v-model="filters.key"
                          :disabled="!isNew" />
                        <label
                          class="form-check-label"
                          :for="`schema-label-selector-${label.key}`"><strong>{{ label.key }}</strong> – {{
                            label.name
                          }}</label>
                      </li>
                    </ul>
                  </div>
                  <div class="mb-3 border-bottom" v-if="filters.key.length > 0">
                    <div class="form-label">
                      Repeats to resolve
                      <ToolTip>
                        Allows you to select which annotations to resolve if annotations can have an order.
                        For example, whether to only resolve primary annotation of a kind (and ignore secondary,...)
                        annotations.
                      </ToolTip>
                    </div>
                    <div class="form-check form-check-inline" v-if="filters.key.length > 0">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-1"
                        :value="1"
                        v-model="filters.repeat"
                        :disabled="!isNew">
                      <label class="form-check-label" for="repeat-selector-1">1</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-2"
                        :value="2"
                        v-model="filters.repeat"
                        :disabled="!isNew">
                      <label class="form-check-label" for="repeat-selector-2">2</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-3"
                        :value="3"
                        v-model="filters.repeat"
                        :disabled="!isNew">
                      <label class="form-check-label" for="repeat-selector-3">3</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-4"
                        :value="4"
                        v-model="filters.repeat"
                        :disabled="!isNew">
                      <label class="form-check-label" for="repeat-selector-4">4</label>
                    </div>
                  </div>
                  <div class="mb-3 border-bottom" v-if="filters.key.length > 0">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="ignoreHierarchy"
                        id="check-ignore-hierarchy"
                        :disabled="!isNew">
                      <label class="form-check-label" for="check-ignore-hierarchy">
                        Ignore scheme hierarchy
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="ignoreOrder"
                        id="check-ignore-order"
                        :disabled="!isNew">
                      <label class="form-check-label" for="check-ignore-order">
                        Ignore annotation order (<code>repeat</code>s)
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div v-if="(assignmentScopes || []).length > 0" class="mb-3 border-bottom">
                    <div class="form-label">Source assignment scopes</div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="scope in assignmentScopes" :key="scope.assignment_scope_id">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`scope-selector-${scope.assignment_scope_id}`"
                          :value="scope.assignment_scope_id"
                          v-model="filters.scope_id"
                          :disabled="!isNew" />
                        <label
                          class="form-check-label"
                          :for="`scope-selector-${scope.assignment_scope_id}`">{{ scope.name }}</label>
                      </li>
                    </ul>
                  </div>
                  <div v-if="(annotators || []).length > 0" class="mb-3 border-bottom">
                    <div class="form-label">Annotator selector</div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="user in annotators" :key="user.user_id">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`annotator-selector-${user.user_id}`"
                          :value="user.user_id"
                          v-model="filters.user_id"
                          :disabled="!isNew" />
                        <label
                          class="form-check-label"
                          :for="`annotator-selector-${user.user_id}`">
                          <strong>{{ user.username }}</strong> – {{ user.full_name }}
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div class="mb-3">
                    <label for="algorithm-selector" class="form-label">Resolution algorithm</label>
                    <select
                      id="algorithm-selector"
                      class="form-select"
                      aria-label="Resolution algorithm"
                      disabled
                      v-model="algorithm">
                      <!--:disabled="!isNew">-->
                      <option value="majority">majority vote</option>
                      <!--<option value="trust" disabled>weighted majority</option>-->
                      <!--<option value="first" disabled>first annotation</option>-->
                      <!--<option value="last" disabled>last annotation</option>-->
                      <!--<option value="??" disabled>sorcery</option>-->
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col text-start">
                  <input type="checkbox" name="showText" id="showText-check" v-model="showText" />
                  <label for="showText-check" class="ms-1">Show text</label>
                </div>
                <div class="col text-end">
                  <button
                    v-if="loadingProposals"
                    class="btn btn-primary"
                    type="button"
                    disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Loading...
                  </button>
                  <button
                    v-else
                    class="btn btn-primary"
                    type="button"
                    @click="fetchProposal"
                    :disabled="!isConfigValid || !isNew">
                    Load
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5" v-if="isTableReady">
      <div class="table-responsive-sm position-relative">
        <table class="table" style="width: calc(100% - 1rem)">
          <thead class="sticky-top bg-light">
            <tr>
              <th>
                #
              </th>
              <th>
                Item
                <label for="item-id-search" class="d-none">Search</label>
                <input
                  id="item-id-search"
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Filter item_id"
                  v-model="itemIdSearch" />
              </th>
              <th v-for="label in collection.labels" :key="label2string(label)" class="text-end">
                <div v-for="skey in label.slice().reverse()" :key="skey.key" class="nacsos-tooltip label-pill m-1">
                  <span>{{ skey.key }}</span>
                  <span>{{ skey.repeat }}</span>
                  <div
                    class="nacsos-tooltiptext popover bs-popover-auto show bg-light p-0"
                    style="position: absolute; right: 0; margin: 0.5rem 0 0 0;"
                    role="tooltip"
                    data-popper-placement="bottom">
                    <div
                      class="popover-arrow"
                      style="position: absolute; right: 0; transform: translateX(-30px);" />
                    <h3 class="popover-header text-dark">{{ schemeLookup[skey.key].name }}</h3>
                    <div class="popover-body">
                      Type: {{ schemeLookup[skey.key].kind }}
                      <template v-if="hasChoices(schemeLookup[skey.key].choices)">
                        <ul class="list-unstyled">
                          <li v-for="choice in schemeLookup[skey.key].choices" :key="choice.value">
                            <strong>{{ choice.value }}:</strong> {{ choice.name }}
                          </li>
                        </ul>
                      </template>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <ResolverRow
            v-for="(itemId, run) in Object.keys(collection.annotations)"
            :key="itemId"
            v-show="itemIdSearch === '' || itemId.indexOf(itemIdSearch) >= 0"
            :row-idx="run"
            :item-id="itemId"
            :row="matrix[itemId]"
            :label-lookup="labels"
            :scheme-lookup="schemeLookup"
            :user-lookup="userLookup"
            :selected-user-lookup="selectedUserLookup"
            :show-text="showText"
            @bot-annotation-changed="handleChangedBotAnnotation"
            @request-focus-item="(val) => focusItem = val" />
        </table>
      </div>
    </div>
    <div v-if="isTableReady" class="bg-light p-1" style="position: absolute; right: 2rem; bottom: 1rem;">
      <div class="col">
        <button
          @click="save"
          type="button"
          class="btn btn-success m-2">Save
        </button>
      </div>
    </div>
    <ItemModal :item-id="focusItem" @dismissed="focusItem = undefined" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { currentProjectStore } from '@/stores';
import type {
  AnnotationSchemeModel,
  AnnotationModel,
  FlattenedAnnotationSchemeLabel,
  AssignmentScopeModel,
  BotAnnotationModel,
  AnnotationFilters,
  Label,
  UserModel,
  AnnotationCollectionDB,
  AnnotationSchemeLabelChoiceFlat,
  AnnotationCollection,
} from '@/plugins/api/api-core';
import { BotMetaResolve, ResolutionPayload } from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import ItemModal from '@/components/items/ItemModal.vue';
import ToolTip from '@/components/ToolTip.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import ResolverRow from '@/components/annotations/resolve/ResolverRow.vue';

type LookupMatrix = Record<string, Record<string, { users: AnnotationModel[], bot: BotAnnotationModel | undefined }>>;
type LabelLookupValue = {
  parentChoice?: number,
  parentKey?: string,
  path: Label[],
  strParent?: string,
};
type LabelLookup = Record<string, LabelLookupValue>;

type ResolveData = {
  botAnnotationMetaDataId: string | undefined,
  isNew: boolean, // set to true if this is not saved yet
  name: string,
  algorithm: BotMetaResolve.algorithm,
  ignoreHierarchy: boolean,
  ignoreOrder: boolean,
  filters: Partial<AnnotationFilters>,
  schemeFlat: FlattenedAnnotationSchemeLabel[],
  collection: AnnotationCollectionDB | AnnotationCollection | undefined,
  botAnnotations: Record<string, Array<[Label[], BotAnnotationModel]>>,
  // id of item in focus (to be opened in modal)
  focusItem: string | undefined,
  // only used for setup (empty when botAnnotationMetaDataId not None)
  projectAnnotationSchemes: AnnotationSchemeModel[],
  // assignment scopes linking to filters.scheme_id
  assignmentScopes: AssignmentScopeModel[],
  annotators: UserModel[],
  loadingProposals: boolean,
  itemIdSearch: string,
  // timeout-interval handler for auto-saving
  autoSave: number | undefined,
  // if this is set to true, the item text is loaded and shown in the table
  showText: boolean,
};

export default defineComponent({
  name: 'AnnotationConfigResolveView',
  components: { ResolverRow, ToolTip, ItemModal },
  data(): ResolveData {
    const botAnnotationMetaDataId: string | undefined = this.$route.params.bot_annotation_metadata_id as string | undefined;

    return {
      botAnnotationMetaDataId,
      isNew: !botAnnotationMetaDataId,
      name: '',
      filters: {
        scheme_id: undefined,
        scope_id: [] as string[],
        key: [] as string[],
        user_id: [] as string[],
        repeat: [1, 2, 3, 4],
      } as Partial<AnnotationFilters>,
      algorithm: BotMetaResolve.algorithm.MAJORITY,
      ignoreHierarchy: false,
      ignoreOrder: false,
      schemeFlat: [] as FlattenedAnnotationSchemeLabel[],
      collection: undefined as AnnotationCollectionDB | AnnotationCollection | undefined,
      botAnnotations: {} as Record<string, Array<[Label[], BotAnnotationModel]>>,
      focusItem: undefined as string | undefined,
      projectAnnotationSchemes: [] as AnnotationSchemeModel[],
      assignmentScopes: [] as AssignmentScopeModel[],
      annotators: [] as UserModel[],
      loadingProposals: false,
      itemIdSearch: '',
      autoSave: undefined,
      showText: false,
    };
  },

  mounted() {
    this.fetchProjectSchemas();

    this.autoSave = setInterval(() => {
      EventBus.emit(new ToastEvent('INFO', 'You might want to click save every now and then...'));
    }, 300000); // called every 5 min

    // Prevent browser page reload and tab closure
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    });

    if (!this.isNew && this.botAnnotationMetaDataId !== undefined) {
      API.core.annotations.getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdGet({
        botAnnotationMetadataId: this.botAnnotationMetaDataId,
        xProjectId: currentProjectStore.projectId as string,
      }).then((response) => {
        const { data } = response;

        this.name = data.name;
        this.algorithm = data.meta.algorithm;
        this.filters = data.meta.filters;
        this.ignoreOrder = data.meta.ignore_repeat;
        this.ignoreHierarchy = data.meta.ignore_hierarchy;
        this.collection = data.meta.collection;
        this.botAnnotations = data.saved as unknown as Record<string, [Label[], BotAnnotationModel][]>;
      });
    }
  },

  watch: {
    'filters.scheme_id': {
      handler(schemeId: string) {
        if (schemeId) {
          // fetch `AssignmentScope`s for the current `AnnotationScheme`
          API.core.annotations.getAssignmentScopesForSchemeApiAnnotationsConfigScopesSchemeIdGet({
            schemeId,
            xProjectId: currentProjectStore.projectId as string,
          }).then((response) => {
            const { data } = response;
            this.assignmentScopes = data;
          });

          // fetch `Users`s that created annotations linked to the current `AnnotationScheme`
          API.core.annotations.getAnnotatorsForSchemeApiAnnotationsConfigAnnotatorsSchemeIdGet({
            schemeId,
            xProjectId: currentProjectStore.projectId as string,
          }).then((response) => {
            const { data } = response;
            this.annotators = data;
          });

          // fetch flattened annotation scheme
          API.core.annotations.getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
            annotationSchemeId: schemeId,
            xProjectId: currentProjectStore.projectId as string,
            flat: true,
          }).then((response) => {
            const { data } = response;
            this.schemeFlat = data.labels as FlattenedAnnotationSchemeLabel[];
          });
        }
      },
      immediate: true,
    },
  },

  methods: {
    hasChoices(value: AnnotationSchemeLabelChoiceFlat[] | undefined) {
      return value !== undefined && Array.isArray(value) && value.length > 0;
    },
    fetchProposal() {
      this.loadingProposals = true;
      API.core.annotations.getResolvedAnnotationsApiAnnotationsConfigResolveGet({
        strategy: this.algorithm,
        xProjectId: currentProjectStore.projectId as string,
        schemeId: this.filters.scheme_id as string,
        scopeId: (!this.filters.scope_id) ? undefined : [this.filters.scope_id] as string[],
        userId: (!this.filters.user_id) ? undefined : [this.filters.user_id] as string[],
        key: (!this.filters.key) ? undefined : [this.filters.key] as string[],
        repeat: (!this.filters.repeat) ? undefined : [this.filters.repeat] as number[],
        ignoreHierarchy: this.ignoreHierarchy,
        ignoreOrder: this.ignoreOrder,
      }).then((response) => {
        const { data } = response;
        this.collection = data.collection;
        this.botAnnotations = data.proposal as unknown as Record<string, [Label[], BotAnnotationModel][]>;
        this.loadingProposals = false;
      }).catch((reason) => {
        if (reason.error?.detail?.type === 'EmptyAnnotationsError') {
          EventBus.emit(new ToastEvent('WARN', reason.error?.detail?.message));
        } else {
          EventBus.emit(new ToastEvent('ERROR', 'Something failed in the backend. '
            + 'Please check for potentially implausible configuration or contact a developer.'));
        }
        this.loadingProposals = false;
      });
    },
    fetchProjectSchemas() {
      API.core.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
        projectId: currentProjectStore.projectId as string,
        xProjectId: currentProjectStore.projectId as string,
      }).then((response) => {
        const { data } = response;
        this.projectAnnotationSchemes = data;
      });
    },
    handleChangedBotAnnotation(updatedBotAnnotation: BotAnnotationModel) {
      console.log(updatedBotAnnotation);
    },
    save() {
      if (!this.isNew) {
        this.update();
      } else {
        this.saveNew();
      }
    },
    update() {
      API.core.annotations.updateResolvedAnnotationsApiAnnotationsConfigResolveUpdatePut({
        botAnnotationMetadataId: this.botAnnotationMetaDataId as string,
        name: this.name,
        xProjectId: currentProjectStore.projectId as string,
        requestBody: this.flattenBotAnnotations(),
      });
    },
    flattenBotAnnotations(): BotAnnotationModel[] {
      return (Object.values(this.botAnnotations) as [Label[], BotAnnotationModel][][])
        .map((itemAnnotations) => (itemAnnotations as [Label[], BotAnnotationModel][])
          .map(([, annotation]) => annotation)).flat();
    },
    saveNew() {
      if (!this.collection) {
        EventBus.emit(new ToastEvent('WARN', 'Nothing to save (yet)!'));
        return;
      }
      const annotatorUserIds: string [] = (this.collection.annotators as UserModel[]).map((user: UserModel) => user.user_id as string);
      const collection: AnnotationCollectionDB = JSON.parse(JSON.stringify(this.collection));
      collection.annotators = annotatorUserIds;
      API.core.annotations.saveResolvedAnnotationsApiAnnotationsConfigResolvePut({
        xProjectId: currentProjectStore.projectId as string,
        requestBody: {
          name: this.name,
          strategy: this.algorithm as unknown as ResolutionPayload.strategy,
          filters: this.filters as AnnotationFilters,
          ignore_order: this.ignoreOrder,
          ignore_hierarchy: this.ignoreHierarchy,
          collection,
          bot_annotations: this.flattenBotAnnotations(),
        },
      }).then((response) => {
        const { data } = response;
        EventBus.emit(new ToastEvent('SUCCESS', `Saved new annotation resolution as ${data}`));
        this.isNew = false;
        this.botAnnotationMetaDataId = data;
        this.$router.replace({ name: 'config-annotation-resolve', params: { bot_annotation_metadata_id: data } });
      }).catch((reason) => {
        console.error(reason);
        EventBus.emit(new ToastEvent('ERROR', 'Failed to save new annotation resolution!'));
      });
    },
    label2string(label: Label[]) {
      return label.map((label_: Label) => `${label_.key}:${label_.repeat}`).join('-');
    },
  },
  computed: {
    userLookup(): Record<string, UserModel> {
      if (!this.annotators) {
        return {};
      }
      return Object.fromEntries(this.annotators.map((user: UserModel) => [user.user_id, user]));
    },
    selectedUserLookup(): Record<string, UserModel> {
      if (!this.annotators) {
        return {};
      }
      return Object.fromEntries(
        this.annotators
          .map((user: UserModel) => [user.user_id, user])
          .filter((entry: [string, UserModel]) => (this.filters.user_id ?? []).indexOf(entry[0]) >= 0),
      );
    },
    labels(): LabelLookup {
      if (!this.collection || !this.collection.labels || Object.keys(this.schemeLookup).length === 0) {
        return {};
      }
      return Object.fromEntries(this.collection.labels.map((label: Label[]) => [this.label2string(label),
        {
          path: label,
          strParent: (label.length > 1) ? this.label2string(label.slice(1)) : undefined,
          parentChoice: this.schemeLookup[label[0].key]?.parent_choice,
          parentKey: this.schemeLookup[label[0].key]?.parent_label,
        }]));
    },
    schemeLookup(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.schemeFlat) return {};
      return Object.fromEntries(this.schemeFlat.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]));
    },
    isTableReady(): boolean {
      return !!this.collection && this.collection.annotations && Object.keys(this.labels).length > 0;
    },
    isConfigValid(): boolean {
      // returns true if all necessary data is available to request a resolution proposal
      return !!this.filters.scheme_id && (this.filters.key || []).length > 0 && (this.filters.user_id || []).length > 0;
    },
    matrix(): LookupMatrix {
      if (!this.collection || !this.collection.annotations) {
        return {};
      }
      const itemIds = Object.keys(this.collection.annotations);
      const strPaths = Object.keys(this.labels);

      const matrix = Object.fromEntries(itemIds.map((itemId) => [
        itemId,
        Object.fromEntries(strPaths.map((strPath) => [
          strPath,
          {
            users: [] as AnnotationModel[],
            bot: undefined as BotAnnotationModel | undefined,
          }]))]));

      Object.entries(this.collection.annotations).forEach((entry) => {
        const [itemId, groupedAnnotations] = entry as [string, Array<[Label[], AnnotationModel[]]>];
        groupedAnnotations.forEach(([path, annotations]) => {
          matrix[itemId][this.label2string(path)].users = annotations;
        });
      });
      if (this.botAnnotations) {
        Object.entries(this.botAnnotations).forEach((entry) => {
          const [itemId, botAnnotationEntry] = entry as [string, Array<[Label[], BotAnnotationModel]>];
          botAnnotationEntry.forEach(([path, botAnnotation]) => {
            const strPath = this.label2string(path);
            matrix[itemId][strPath].bot = botAnnotation;
          });
        });
      }
      return matrix;
    },
  },
  beforeRouteLeave(to, from, next) {
    EventBus.emit(new ConfirmationRequestEvent(
      'You will loose data if you have not clicked "save".',
      (confirmationResponse) => {
        if (confirmationResponse === 'ACCEPT') {
          clearInterval(this.autoSave);
          next(true);
        } else {
          next(false);
        }
      },
      'Do you really want to leave?',
      'I understand.',
      'Oh right, stop, let me save first.',
    ));
  },
});
</script>

<style scoped>
.label-pill {
  display: block !important;
}

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
