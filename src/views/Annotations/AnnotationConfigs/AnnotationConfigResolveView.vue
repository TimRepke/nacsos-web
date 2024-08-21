<template>
  <div>
    <div class="row">
      <h1>Annotation resolutions</h1>
    </div>

    <div class="row">
      <div class="col-12 col-lg-6">
        <div class="form-floating">
          <input type="text" class="form-control" id="resolve-name" v-model="name" placeholder="Name" />
          <label for="resolve-name">Descriptive name for this annotation export</label>
        </div>
        <code v-if="bot_annotation_metadata_id" class="ms-1">{{ bot_annotation_metadata_id }}</code>
        <div class="row mt-3">
          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="settings.ignore_hierarchy"
                id="check-ignore-hierarchy"
                :disabled="!isNew"
              />
              <label class="form-check-label" for="check-ignore-hierarchy">
                Ignore scheme hierarchy
                <ToolTip>
                  If you have nested labels in your annotation scheme, we will keep track of all parents/children.
                  Selecting this option will ignore these relationships and present you with a "flat" list of labels.
                </ToolTip>
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="settings.ignore_repeat"
                id="check-ignore-order"
                :disabled="!isNew"
              />
              <label class="form-check-label" for="check-ignore-order">
                Ignore label order (<code>repeat</code>s)
                <ToolTip>
                  Select this if you'd like to ignore the order of labels for those that are repeatable. This might be
                  useful if you allowed labels to be primary, secondary, ... but now would like to treat them all the
                  same.
                </ToolTip>
              </label>
            </div>
          </div>
          <div class="col border-start">
            <div>
              <input type="checkbox" name="showText" id="showText-check" v-model="showText" />
              <label for="showText-check" class="ms-1">Show text</label>
            </div>
            <div v-if="isNew" class="text-end">
              <button class="btn btn-primary" type="button" @click="fetchProposal" :disabled="loadingProposals">
                <template v-if="loadingProposals">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  Loading...
                </template>
                <template v-else> Load proposals</template>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6 order-first order-lg-last mb-2">
        <div v-if="annotationScheme">
          Annotation scheme:
          <span class="fw-bolder me-1">{{ annotationScheme.name }}</span>
          <pop-over
            v-if="annotationScheme.description"
            class="d-inline-block me-2"
            title="Annotation scheme description"
            :body-m-d="annotationScheme.description"
          />
          <code class="me-1 small">{{ annotationScheme.annotation_scheme_id }}</code>
          <router-link
            :to="{
              name: 'config-annotation-scheme-edit',
              params: { annotation_scheme_id: annotationScheme.annotation_scheme_id },
            }"
            class="small"
          >
            <font-awesome-icon icon="up-right-from-square" />
          </router-link>
        </div>
        <div v-if="assignmentScope">
          Assignment scope:
          <span class="fw-bolder me-1">{{ assignmentScope.name }}</span>
          <pop-over
            v-if="assignmentScope.description"
            class="d-inline-block me-2"
            title="Assignment scope description"
            :body-m-d="assignmentScope.description"
          />
          <code class="me-1 small">{{ assignmentScope.assignment_scope_id }}</code>
          <router-link
            :to="{
              name: 'config-annotation-scheme-scope',
              params: { scope_id: assignmentScope.assignment_scope_id },
            }"
            class="small"
          >
            <font-awesome-icon icon="up-right-from-square" />
          </router-link>
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
                <LabelPathPills :label="label" :scheme-lookup="schemeLookup" />
              </th>
            </tr>
          </thead>
          <ResolverRow
            v-for="orderEntry in proposal.ordering"
            :key="orderEntry.identifier"
            v-show="itemIdSearch === '' || orderEntry.item_id.indexOf(itemIdSearch) >= 0"
            :ordering="orderEntry"
            :row="proposal.matrix[orderEntry.item_id]"
            :user-lookup="userLookup"
            :users="proposal.annotators"
            :label-lookup="labels"
            :labels="proposal.labels"
            :show-text="showText"
            :bot-annotation-meta-data-id="bot_annotation_metadata_id"
            @bot-annotation-changed="handleChangedBotAnnotation"
            @request-focus-item="(val: string) => (focusItem = val)"
          />
        </table>
      </div>
    </div>

    <div v-if="isTableReady" class="bg-light p-1" style="position: absolute; right: 2rem; bottom: 1rem">
      <div class="col">
        <button @click="save" :disabled="!savingAllowed || name.length < 3" type="button" class="btn btn-success m-2">
          Save
        </button>
      </div>
    </div>

    <ItemModal :item-id="focusItem" @dismissed="focusItem = undefined" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore, platformUsersStore } from "@/stores";
import type {
  AnnotationSchemeModelFlat,
  FlattenedAnnotationSchemeLabel,
  AssignmentScopeModel,
  BotAnnotationModel,
  ResolutionProposal,
  FlatLabel,
  BotMetaResolveBase,
  DehydratedUser,
} from "@/plugins/api/spec/types.gen";
import { ResolutionMethodEnum } from "@/plugins/api/spec/enums.gen";
import { API, toastReject } from "@/plugins/api";
import ItemModal from "@/components/items/ItemModal.vue";
import ToolTip from "@/components/ToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import ResolverRow from "@/components/annotations/resolve/ResolverRow.vue";
import LabelPathPills from "@/components/annotations/LabelPathPills.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PopOver from "@/components/PopOver.vue";

function tabClosePrevent(e: BeforeUnloadEvent) {
  e.preventDefault();
  // eslint-disable-next-line no-param-reassign
  e.returnValue = "";
}

function normalise(str: string | null | undefined): string | undefined {
  return !str || str.trim().length === 0 ? undefined : str.trim();
}

export default defineComponent({
  name: "AnnotationConfigResolveView",
  components: { PopOver, FontAwesomeIcon, LabelPathPills, ResolverRow, ToolTip, ItemModal },
  data() {
    const { bot_annotation_metadata_id, assignment_scope_id, annotation_scheme_id } = this.$route.params;
    const meta_id = normalise(bot_annotation_metadata_id as string | undefined);

    return {
      // References
      bot_annotation_metadata_id: meta_id,
      assignment_scope_id: normalise(assignment_scope_id as string | undefined),
      annotation_scheme_id: normalise(annotation_scheme_id as string | undefined),

      // Meta-data
      name: "",
      settings: {
        ignore_hierarchy: false,
        ignore_repeat: false,
        algorithm: ResolutionMethodEnum.MAJORITY,
      } as BotMetaResolveBase,

      // Models
      assignmentScope: undefined as AssignmentScopeModel | undefined,
      annotationScheme: undefined as AnnotationSchemeModelFlat | undefined,
      proposal: undefined as ResolutionProposal | undefined,

      // State
      isNew: !meta_id,
      focusItem: undefined as string | undefined,
      loadingProposals: false,
      savingAllowed: true,

      // Settings
      showText: false,
      itemIdSearch: "",
      saveReminder: undefined as undefined | number,
    };
  },
  unmounted() {
    clearInterval(this.saveReminder);
    window.removeEventListener("beforeunload", tabClosePrevent);
  },
  async mounted() {
    this.saveReminder = setInterval(() => {
      EventBus.emit(new ToastEvent("INFO", "You might want to click save every now and then..."));
    }, 300000) as unknown as number; // called every 5 min

    // Prevent browser page reload and tab closure
    window.addEventListener("beforeunload", tabClosePrevent);

    try {
      if (!this.isNew && this.bot_annotation_metadata_id) {
        const { meta, proposal } = (
          await API.annotations.getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetadataIdGet({
            botAnnotationMetadataId: this.bot_annotation_metadata_id,
            xProjectId: currentProjectStore.projectId as string,
          })
        ).data;
        this.name = meta.name;
        this.annotation_scheme_id = meta.annotation_scheme_id;
        this.assignment_scope_id = meta.assignment_scope_id;
        this.settings.ignore_repeat = meta.meta.ignore_repeat;
        this.settings.ignore_hierarchy = meta.meta.ignore_hierarchy;
        this.proposal = proposal;
      }
      if (this.annotation_scheme_id) {
        this.annotationScheme = (
          await API.annotations.getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
            annotationSchemeId: this.annotation_scheme_id,
            xProjectId: currentProjectStore.projectId as string,
            flat: true,
          })
        ).data as AnnotationSchemeModelFlat;
      }
      if (this.assignment_scope_id) {
        this.assignmentScope = (
          await API.annotations.getAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdGet({
            assignmentScopeId: this.assignment_scope_id,
            xProjectId: currentProjectStore.projectId as string,
          })
        ).data;

        if (this.isNew) {
          this.name = `Resolved_${this.assignmentScope.name}`;
        }
      }

      await platformUsersStore.maybeRefresh();
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    save() {
      if (this.savingAllowed) {
        this.savingAllowed = false;
        if (!this.isNew) {
          this.update();
        } else {
          this.saveNew();
        }
      }
    },
    update() {
      if (!this.proposal?.matrix) {
        EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
        this.savingAllowed = true;
      } else {
        API.annotations
          .updateResolvedAnnotationsApiAnnotationsConfigResolveUpdatePut({
            botAnnotationMetadataId: this.bot_annotation_metadata_id as string,
            name: this.name,
            xProjectId: currentProjectStore.projectId as string,
            requestBody: this.proposal.matrix,
          })
          .then(() => EventBus.emit(new ToastEvent("SUCCESS", "Updated resolution")))
          .catch(toastReject)
          .finally(() => {
            this.savingAllowed = true;
          });
      }
    },
    saveNew() {
      if (!this.proposal || !this.assignment_scope_id || !this.annotation_scheme_id) {
        EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
        this.savingAllowed = true;
      } else {
        API.annotations
          .saveResolvedAnnotationsApiAnnotationsConfigResolvePut({
            xProjectId: currentProjectStore.projectId as string,
            assignmentScopeId: this.assignment_scope_id,
            annotationSchemeId: this.annotation_scheme_id,
            name: this.name,
            requestBody: {
              settings: this.settings,
              matrix: this.proposal.matrix,
            },
          })
          .then((response) => {
            const { data } = response;
            EventBus.emit(new ToastEvent("SUCCESS", `Saved new annotation resolution as ${data}`));
            this.isNew = false;
            this.bot_annotation_metadata_id = data;
            this.$router.replace({ name: "config-annotation-resolve", params: { bot_annotation_metadata_id: data } });
          })
          .catch((reason) => {
            console.error(reason);
            EventBus.emit(new ToastEvent("ERROR", "Failed to save new annotation resolution!"));
          })
          .finally(() => {
            this.savingAllowed = true;
          });
      }
    },
    fetchProposal() {
      this.loadingProposals = true;
      API.annotations
        .getResolvedAnnotationsApiAnnotationsConfigResolvePost({
          assignmentScopeId: this.assignment_scope_id,
          botAnnotationMetadatId: this.bot_annotation_metadata_id,
          includeEmpty: true,
          includeNew: true,
          updateExisting: false,
          requestBody: this.settings,
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
    handleChangedBotAnnotation(updatedBotAnnotation: BotAnnotationModel) {
      console.log(updatedBotAnnotation);
    },
  },
  computed: {
    userLookup(): Record<string, DehydratedUser> {
      return platformUsersStore.userLookup;
    },
    labels(): Record<string, FlatLabel> {
      if (!this.proposal) {
        return {};
      }
      return Object.fromEntries(this.proposal.labels.map((label: FlatLabel) => [label.path_key, label]));
    },
    isTableReady(): boolean {
      return !!this.proposal;
    },
    schemeLookup(): Record<string, FlattenedAnnotationSchemeLabel> {
      if (!this.annotationScheme || !this.annotationScheme.labels) return {};
      return Object.fromEntries(
        this.annotationScheme.labels.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]),
      );
    },
  },
  beforeRouteLeave(to, from, next) {
    EventBus.emit(
      new ConfirmationRequestEvent(
        'You will loose data if you have not clicked "save".',
        (confirmationResponse) => {
          if (confirmationResponse === "ACCEPT") {
            clearInterval(this.saveReminder);
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

<style scoped></style>
