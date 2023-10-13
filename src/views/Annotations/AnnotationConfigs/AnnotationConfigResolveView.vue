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
              aria-controls="resolve-config"
            >
              Annotation Export Configuration
            </button>
          </h2>
          <div id="resolve-config" class="accordion-collapse collapse show">
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
                      v-model="filters.scheme_id"
                    >
                      <option :value="undefined" disabled>Please choose...</option>
                      <option
                        v-for="scheme in projectAnnotationSchemes"
                        :key="scheme.annotation_scheme_id as string"
                        :value="scheme.annotation_scheme_id"
                      >
                        {{ scheme.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="schemeFlat.length > 0" class="mb-3 border-bottom">
                    <div class="form-label">
                      <span class="me-4">Scheme labels to resolve</span>
                      <span class="text-muted small" role="button" @click="pickAllKeys">
                        <font-awesome-icon :icon="['fas', 'list-check']" class="me-1" />
                        All
                      </span>
                    </div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="label in schemeFlat" :key="label.key">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`schema-label-selector-${label.key}`"
                          :value="label.key"
                          v-model="filters.key"
                          :disabled="!isNew"
                        />
                        <label class="form-check-label" :for="`schema-label-selector-${label.key}`">
                          <strong>{{ label.key }}</strong> – {{ label.name }}
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div class="mb-3 border-bottom" v-if="filters.key && filters.key.length > 0">
                    <div class="form-label">
                      Repeats to resolve
                      <ToolTip>
                        Allows you to select which annotations to resolve if annotations can have an order. For example,
                        whether to only resolve primary annotation of a kind (and ignore secondary,...) annotations.
                      </ToolTip>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-1"
                        :value="1"
                        v-model="filters.repeat"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="repeat-selector-1">1</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-2"
                        :value="2"
                        v-model="filters.repeat"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="repeat-selector-2">2</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-3"
                        :value="3"
                        v-model="filters.repeat"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="repeat-selector-3">3</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="repeat-selector-4"
                        :value="4"
                        v-model="filters.repeat"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="repeat-selector-4">4</label>
                    </div>
                  </div>
                  <div class="mb-3 border-bottom" v-if="filters.key && filters.key.length > 0">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="ignoreHierarchy"
                        id="check-ignore-hierarchy"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="check-ignore-hierarchy">
                        Ignore scheme hierarchy
                        <ToolTip>
                          If you have nested labels in your annotation scheme, we will keep track of all
                          parents/children. Selecting this option will ignore these relationships and present you with a
                          "flat" list of labels.
                        </ToolTip>
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="ignoreRepeat"
                        id="check-ignore-order"
                        :disabled="!isNew"
                      />
                      <label class="form-check-label" for="check-ignore-order">
                        Ignore label order (<code>repeat</code>s)
                        <ToolTip>
                          Select this if you'd like to ignore the order of labels for those that are repeatable. This
                          might be useful if you allowed labels to be primary, secondary, ... but now would like to
                          treat them all the same.
                        </ToolTip>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div v-if="(assignmentScopes || []).length > 0" class="mb-3 border-bottom">
                    <div class="form-label">Source assignment scopes</div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="scope in assignmentScopes" :key="scope.assignment_scope_id as string">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`scope-selector-${scope.assignment_scope_id}`"
                          :value="scope.assignment_scope_id"
                          v-model="filters.scope_id"
                          :disabled="!isNew"
                        />
                        <label class="form-check-label" :for="`scope-selector-${scope.assignment_scope_id}`">{{
                          scope.name
                        }}</label>
                      </li>
                    </ul>
                  </div>
                  <div v-if="(annotators || []).length > 0" class="mb-3 border-bottom">
                    <div class="form-label">
                      <span class="me-4">Annotator selector</span>
                      <span class="text-muted small" role="button" @click="pickAllAnnotators">
                        <font-awesome-icon :icon="['fas', 'list-check']" class="me-1" />
                        All
                      </span>
                    </div>
                    <ul class="list-unstyled ms-lg-2">
                      <li v-for="user in annotators" :key="user.user_id!">
                        <input
                          class="form-check-input me-1"
                          type="checkbox"
                          :id="`annotator-selector-${user.user_id}`"
                          :value="user.user_id"
                          v-model="filters.user_id"
                          :disabled="!isNew"
                        />
                        <label class="form-check-label" :for="`annotator-selector-${user.user_id}`">
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
                      v-model="algorithm"
                    >
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
                  <button v-if="loadingProposals" class="btn btn-primary" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Loading...
                  </button>
                  <button
                    v-else
                    class="btn btn-primary"
                    type="button"
                    @click="fetchProposal"
                    :disabled="!isConfigValid || !isNew"
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-5 mt-2" v-if="isTableReady && proposal">
      <div class="table-responsive-sm position-relative">
        <table class="table" style="width: calc(100% - 1rem)">
          <thead class="sticky-top bg-light">
            <tr>
              <th>#</th>
              <th>
                Item
                <label for="item-id-search" class="d-none">Search</label>
                <input
                  id="item-id-search"
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="Filter item_id"
                  v-model="itemIdSearch"
                />
              </th>
              <th v-for="label in proposal.labels" :key="label.path_key" class="text-end">
                <div
                  v-for="skey in label.path.slice().reverse()"
                  :key="skey.key"
                  class="nacsos-tooltip label-pill d-flex flex-nowrap justify-content-end"
                >
                  <span>{{ skey.key }}</span>
                  <span v-if="skey.value !== null && skey.value !== undefined" class="text-muted small">
                    ({{ skey.value }})
                  </span>
                  <span>{{ skey.repeat }}</span>
                  <div
                    class="nacsos-tooltiptext popover bs-popover-auto show bg-light p-0"
                    style="position: absolute; right: 0; margin: 0.5rem 0 0 0"
                    role="tooltip"
                    data-popper-placement="bottom"
                    v-if="schemeLookup[skey.key]"
                  >
                    <div class="popover-arrow" style="position: absolute; right: 0; transform: translateX(-30px)" />
                    <h3 class="popover-header text-dark">{{ schemeLookup[skey.key].name }}</h3>
                    <div class="popover-body">
                      Type: {{ schemeLookup[skey.key].kind }}
                      <template v-if="hasChoices(label.choices)">
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
            v-for="orderEntry in proposal.ordering"
            :key="orderEntry.key"
            v-show="itemIdSearch === '' || orderEntry.item_id.indexOf(itemIdSearch) >= 0"
            :ordering="orderEntry"
            :row="proposal.matrix[orderEntry.key]"
            :user-lookup="userLookup"
            :users="proposal.annotators"
            :label-lookup="labels"
            :labels="proposal.labels"
            :show-text="showText"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="handleChangedBotAnnotation"
            @request-focus-item="(val) => (focusItem = val)"
          />
        </table>
      </div>
    </div>
    <div v-if="isTableReady" class="bg-light p-1" style="position: absolute; right: 2rem; bottom: 1rem">
      <div class="col">
        <button @click="save" type="button" class="btn btn-success m-2">Save</button>
      </div>
    </div>
    <ItemModal :item-id="focusItem" @dismissed="focusItem = undefined" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import type {
  AnnotationSchemeModel,
  FlattenedAnnotationSchemeLabel,
  AssignmentScopeModel,
  BotAnnotationModel,
  AnnotationFilters,
  Label,
  UserModel,
  ResolutionProposal,
  FlatLabel,
  FlatLabelChoice,
} from "@/plugins/api/api-core";
import { BotMetaResolve } from "@/plugins/api/api-core";
import { API } from "@/plugins/api";
import ItemModal from "@/components/items/ItemModal.vue";
import ToolTip from "@/components/ToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import ResolverRow from "@/components/annotations/resolve/ResolverRow.vue";

function tabClosePrevent(e: BeforeUnloadEvent) {
  e.preventDefault();
  // eslint-disable-next-line no-param-reassign
  e.returnValue = "";
}

export default defineComponent({
  name: "AnnotationConfigResolveView",
  components: { ResolverRow, ToolTip, ItemModal },
  data() {
    const botAnnotationMetaDataId: string | undefined = this.$route.params.bot_annotation_metadata_id as
      | string
      | undefined;

    return {
      botAnnotationMetaDataId,
      isNew: !botAnnotationMetaDataId,
      name: "",
      filters: {
        scheme_id: undefined,
        scope_id: [] as string[],
        key: [] as string[],
        user_id: [] as string[],
        repeat: [1, 2, 3, 4],
      } as Partial<AnnotationFilters>,
      algorithm: BotMetaResolve.algorithm.MAJORITY,
      ignoreHierarchy: false,
      ignoreRepeat: false,
      focusItem: undefined as string | undefined,
      projectAnnotationSchemes: [] as AnnotationSchemeModel[],
      assignmentScopes: [] as AssignmentScopeModel[],
      annotators: [] as UserModel[],
      loadingProposals: false,
      itemIdSearch: "",
      autoSave: undefined as undefined | number,
      showText: false,
      proposal: undefined as ResolutionProposal | undefined,
      schemeFlat: [] as FlattenedAnnotationSchemeLabel[],
    };
  },
  unmounted() {
    clearInterval(this.autoSave);
    window.removeEventListener("beforeunload", tabClosePrevent);
  },
  mounted() {
    this.fetchProjectSchemas();

    this.autoSave = setInterval(() => {
      EventBus.emit(new ToastEvent("INFO", "You might want to click save every now and then..."));
    }, 300000) as unknown as number; // called every 5 min

    // Prevent browser page reload and tab closure
    window.addEventListener("beforeunload", tabClosePrevent);

    if (!this.isNew && this.botAnnotationMetaDataId !== undefined) {
      API.core.annotations
        .getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetadataIdGet({
          botAnnotationMetadataId: this.botAnnotationMetaDataId,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          const { meta, proposal } = response.data;
          this.name = meta.name;
          this.algorithm = meta.meta.algorithm;
          this.filters = meta.meta.filters;
          this.ignoreRepeat = meta.meta.ignore_repeat;
          this.ignoreHierarchy = meta.meta.ignore_hierarchy;
          this.proposal = proposal;
        });
    }
  },

  watch: {
    "filters.scheme_id": {
      handler(schemeId: string) {
        if (schemeId) {
          // fetch `AssignmentScope`s for the current `AnnotationScheme`
          API.core.annotations
            .getAssignmentScopesForSchemeApiAnnotationsConfigScopesSchemeIdGet({
              schemeId,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then((response) => {
              const { data } = response;
              this.assignmentScopes = data;
            });

          // fetch `Users`s that created annotations linked to the current `AnnotationScheme`
          API.core.annotations
            .getAnnotatorsForSchemeApiAnnotationsConfigAnnotatorsSchemeIdGet({
              schemeId,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then((response) => {
              const { data } = response;
              this.annotators = data;
            });

          // fetch flattened annotation scheme
          API.core.annotations
            .getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
              annotationSchemeId: schemeId,
              xProjectId: currentProjectStore.projectId as string,
              flat: true,
            })
            .then((response) => {
              const { data } = response;
              this.schemeFlat = data.labels as FlattenedAnnotationSchemeLabel[];
            });
        }
      },
      immediate: true,
    },
  },

  methods: {
    hasChoices(value: FlatLabelChoice[] | undefined | null) {
      return value !== undefined && value !== null && Array.isArray(value) && value.length > 0;
    },
    fetchProposal() {
      this.loadingProposals = true;
      API.core.annotations
        .getResolvedAnnotationsApiAnnotationsConfigResolvePost({
          requestBody: {
            algorithm: this.algorithm,
            ignore_repeat: this.ignoreRepeat,
            ignore_hierarchy: this.ignoreHierarchy,
            filters: {
              scheme_id: this.filters.scheme_id,
              scope_id: this.filters.scope_id,
              user_id: this.filters.user_id,
              key: this.filters.key,
              repeat: this.filters.repeat,
            },
          },
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          const { data } = response;
          this.proposal = data;
          this.loadingProposals = false;
        })
        .catch((reason) => {
          if (reason.error?.detail?.type === "EmptyAnnotationsError") {
            EventBus.emit(new ToastEvent("WARN", reason.error?.detail?.message));
          } else {
            EventBus.emit(
              new ToastEvent(
                "ERROR",
                "Something failed in the backend. " +
                  "Please check for potentially implausible configuration or contact a developer.",
              ),
            );
          }
          this.loadingProposals = false;
        });
    },
    fetchProjectSchemas() {
      API.core.annotations
        .getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
          projectId: currentProjectStore.projectId as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
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
      if (!this.proposal?.matrix) {
        EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
      } else {
        API.core.annotations.updateResolvedAnnotationsApiAnnotationsConfigResolveUpdatePut({
          botAnnotationMetadataId: this.botAnnotationMetaDataId as string,
          name: this.name,
          xProjectId: currentProjectStore.projectId as string,
          requestBody: this.proposal.matrix,
        });
      }
    },
    saveNew() {
      if (!this.proposal) {
        EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
        return;
      }
      API.core.annotations
        .saveResolvedAnnotationsApiAnnotationsConfigResolvePut({
          xProjectId: currentProjectStore.projectId as string,
          name: this.name,
          requestBody: {
            settings: {
              algorithm: this.algorithm,
              filters: {
                scheme_id: this.filters.scheme_id,
                scope_id: this.filters.scope_id,
                user_id: this.filters.user_id,
                key: this.filters.key,
                repeat: this.filters.repeat,
              },
              ignore_hierarchy: this.ignoreHierarchy,
              ignore_repeat: this.ignoreRepeat,
            },
            matrix: this.proposal.matrix,
          },
        })
        .then((response) => {
          const { data } = response;
          EventBus.emit(new ToastEvent("SUCCESS", `Saved new annotation resolution as ${data}`));
          this.isNew = false;
          this.botAnnotationMetaDataId = data;
          this.$router.replace({ name: "config-annotation-resolve", params: { bot_annotation_metadata_id: data } });
        })
        .catch((reason) => {
          console.error(reason);
          EventBus.emit(new ToastEvent("ERROR", "Failed to save new annotation resolution!"));
        });
    },
    label2string(label: Label[]) {
      return label.map((label_: Label) => `${label_.key}:${label_.repeat}`).join("-");
    },
    pickAllKeys() {
      this.filters.key = this.schemeFlat.map((label: FlattenedAnnotationSchemeLabel) => label.key);
    },
    pickAllAnnotators() {
      this.filters.user_id = this.annotators.map((user: UserModel) => user.user_id as string);
    },
  },
  computed: {
    userLookup(): Record<string, UserModel> {
      if (!this.annotators) {
        return {};
      }
      return Object.fromEntries(this.annotators.map((user: UserModel) => [user.user_id, user]));
    },
    labels(): Record<string, FlatLabel> {
      if (!this.proposal) {
        return {};
      }
      return Object.fromEntries(this.proposal.labels.map((label: FlatLabel) => [label.path_key, label]));
    },
    schemeLookup(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.schemeFlat) return {};
      return Object.fromEntries(this.schemeFlat.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]));
    },
    isTableReady(): boolean {
      return !!this.proposal;
    },
    isConfigValid(): boolean {
      // returns true if all necessary data is available to request a resolution proposal
      return !!this.filters.scheme_id && (this.filters.key || []).length > 0 && (this.filters.user_id || []).length > 0;
    },
  },
  beforeRouteLeave(to, from, next) {
    EventBus.emit(
      new ConfirmationRequestEvent(
        'You will loose data if you have not clicked "save".',
        (confirmationResponse) => {
          if (confirmationResponse === "ACCEPT") {
            clearInterval(this.autoSave);
            next(true);
          } else {
            next(false);
          }
        },
        "Do you really want to leave?",
        "I understand.",
        "Oh right, stop, let me save first.",
      ),
    );
  },
});
</script>

<style scoped>
.label-pill {
  /*display: block !important;*/
}

.label-pill > span {
  font-weight: normal;
  font-size: 0.7em;
  border-top: 1px solid var(--bs-gray-500);
  border-bottom: 1px solid var(--bs-gray-500);
  padding-top: 0.2em;
  padding-bottom: 0.2em;
}

.label-pill > span:first-child {
  border: 1px solid var(--bs-gray-500);
  border-right: 0;
  border-top-left-radius: var(--bs-border-radius-pill);
  border-bottom-left-radius: var(--bs-border-radius-pill);
  padding-left: 0.5em;
  padding-right: 0.1em;
}

.label-pill > span:last-of-type {
  border: 1px solid var(--bs-gray-500);
  border-top-right-radius: var(--bs-border-radius-pill);
  border-bottom-right-radius: var(--bs-border-radius-pill);
  background-color: var(--bs-gray-300);
  padding-left: 0.2em;
  padding-right: 0.5em;
}
</style>
