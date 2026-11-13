<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { currentProjectStore, platformUsersStore } from "@/stores";
import type {
  AnnotationSchemeModelFlat,
  FlattenedAnnotationSchemeLabel,
  AssignmentScopeModel,
  ResolutionProposal,
  FlatLabel,
  BotMetaResolveBase,
  DehydratedUser,
  ResolutionCell,
  ResolutionOrdering,
} from "@/plugins/api/spec/types.gen";
import { ResolutionMethod } from "@/plugins/api/spec/types.gen";
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

defineOptions({ name: "AnnotationConfigResolveView" });

function tabClosePrevent(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

function normalise(str: string | null | undefined): string | undefined {
  return !str || str.trim().length === 0 ? undefined : str.trim();
}

/**
 * Freeze the per-user annotation entries of every cell. They are read-only in the UI
 * (tooltip rendering only), and Vue's reactivity system skips frozen objects, so this
 * saves one reactive proxy and dependency tracking per user entry on large matrices.
 */
function freezeCellLabels(p: ResolutionProposal) {
  for (const itemId of Object.keys(p.matrix)) {
    const row = p.matrix[itemId];
    for (const pathKey of Object.keys(row)) {
      const userLabels = row[pathKey]?.labels;
      if (!userLabels || Object.isFrozen(userLabels)) continue;
      for (const key of Object.keys(userLabels)) {
        const entries = userLabels[key];
        for (const entry of entries) Object.freeze(entry);
        Object.freeze(entries);
      }
      Object.freeze(userLabels);
    }
  }
}

const route = useRoute();
const router = useRouter();

// References
const meta_id = normalise(route.params.bot_annotation_metadata_id as string | undefined);
const bot_annotation_metadata_id = ref<string | undefined>(meta_id);
const assignment_scope_id = ref<string | undefined>(normalise(route.params.assignment_scope_id as string | undefined));
const annotation_scheme_id = ref<string | undefined>(
  normalise(route.params.annotation_scheme_id as string | undefined),
);

// Meta-data
const name = ref("");
const settings = reactive<BotMetaResolveBase>({
  ignore_hierarchy: false,
  ignore_repeat: false,
  algorithm: ResolutionMethod.MAJORITY,
});

// Models
const assignmentScope = ref<AssignmentScopeModel | undefined>(undefined);
const annotationScheme = ref<AnnotationSchemeModelFlat | undefined>(undefined);
const proposal = ref<ResolutionProposal | undefined>(undefined);

// State
const isNew = ref(!meta_id);
const focusItem = ref<string | undefined>(undefined);
const loadingProposals = ref(false);
const savingAllowed = ref(true);

// Settings
const showText = ref(false);
const itemIdSearch = ref("");
let saveReminder: ReturnType<typeof setInterval> | undefined = undefined;

onMounted(async () => {
  saveReminder = setInterval(() => {
    EventBus.emit(new ToastEvent("INFO", "You might want to click save every now and then..."));
  }, 300000); // called every 5 min

  // Prevent browser page reload and tab closure
  window.addEventListener("beforeunload", tabClosePrevent);

  try {
    if (!isNew.value && bot_annotation_metadata_id.value) {
      const { meta, proposal: savedProposal } = (
        await API.annotations.getSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetadataIdGet({
          path: { bot_annotation_metadata_id: bot_annotation_metadata_id.value },
          headers: { "x-project-id": currentProjectStore.projectId as string },
        })
      ).data;
      name.value = meta.name;
      annotation_scheme_id.value = meta.annotation_scheme_id;
      assignment_scope_id.value = meta.assignment_scope_id;
      settings.ignore_repeat = meta.meta.ignore_repeat;
      settings.ignore_hierarchy = meta.meta.ignore_hierarchy;
      freezeCellLabels(savedProposal);
      proposal.value = savedProposal;
    }
    if (annotation_scheme_id.value) {
      annotationScheme.value = (
        await API.annotations.getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
          path: { annotation_scheme_id: annotation_scheme_id.value },
          headers: { "x-project-id": currentProjectStore.projectId as string },
          query: { flat: true },
        })
      ).data as AnnotationSchemeModelFlat;
    }
    if (assignment_scope_id.value) {
      const scope = (
        await API.annotations.getAssignmentScopeApiAnnotationsAssignmentsScopeAssignmentScopeIdGet({
          path: { assignment_scope_id: assignment_scope_id.value },
          headers: { "x-project-id": currentProjectStore.projectId as string },
        })
      ).data;
      assignmentScope.value = scope ?? undefined;

      if (isNew.value && scope) {
        name.value = `Resolved_${scope.name}`;
      }
    }

    await platformUsersStore.maybeRefresh();
  } catch (e) {
    console.error(e);
  }
});

onUnmounted(() => {
  clearInterval(saveReminder);
  window.removeEventListener("beforeunload", tabClosePrevent);
});

function save() {
  if (savingAllowed.value) {
    savingAllowed.value = false;
    if (!isNew.value) {
      update();
    } else {
      saveNew();
    }
  }
}

/**
 * Copy of the matrix with empty (or whitespace-only) text resolutions dropped, so that
 * saving never creates annotations without text content.
 */
function sanitizedMatrix(): ResolutionProposal["matrix"] {
  const result: ResolutionProposal["matrix"] = {};
  const matrix = proposal.value?.matrix;
  if (!matrix) return result;
  for (const itemId of Object.keys(matrix)) {
    const row: Record<string, ResolutionCell> = matrix[itemId];
    const cleanRow: Record<string, ResolutionCell> = {};
    for (const pathKey of Object.keys(row)) {
      const cell = row[pathKey];
      const valueStr: string | null | undefined = cell?.resolution?.value_str;
      if (cell?.resolution && typeof valueStr === "string" && valueStr.trim().length === 0) {
        cleanRow[pathKey] = { ...cell, resolution: { ...cell.resolution, value_str: undefined } };
      } else {
        cleanRow[pathKey] = cell;
      }
    }
    result[itemId] = cleanRow;
  }
  return result;
}

function update() {
  if (!proposal.value?.matrix) {
    EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
    savingAllowed.value = true;
  } else {
    API.annotations
      .updateResolvedAnnotationsApiAnnotationsConfigResolveUpdatePut({
        query: {
          bot_annotation_metadata_id: bot_annotation_metadata_id.value as string,
          name: name.value,
        },
        headers: { "x-project-id": currentProjectStore.projectId as string },
        body: sanitizedMatrix(),
      })
      .then(() => EventBus.emit(new ToastEvent("SUCCESS", "Updated resolution")))
      .catch(toastReject)
      .finally(() => {
        savingAllowed.value = true;
      });
  }
}

function saveNew() {
  if (!proposal.value || !assignment_scope_id.value || !annotation_scheme_id.value) {
    EventBus.emit(new ToastEvent("WARN", "Nothing to save (yet)!"));
    savingAllowed.value = true;
  } else {
    API.annotations
      .saveResolvedAnnotationsApiAnnotationsConfigResolvePut({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        query: {
          assignment_scope_id: assignment_scope_id.value,
          annotation_scheme_id: annotation_scheme_id.value,
          name: name.value,
        },
        body: {
          settings: settings,
          matrix: sanitizedMatrix(),
        },
      })
      .then((response) => {
        const { data } = response;
        EventBus.emit(new ToastEvent("SUCCESS", `Saved new annotation resolution as ${data}`));
        isNew.value = false;
        bot_annotation_metadata_id.value = data;
        router.replace({ name: "config-annotation-resolve", params: { bot_annotation_metadata_id: data } });
      })
      .catch((reason) => {
        console.error(reason);
        EventBus.emit(new ToastEvent("ERROR", "Failed to save new annotation resolution!"));
      })
      .finally(() => {
        savingAllowed.value = true;
      });
  }
}

function fetchProposal() {
  loadingProposals.value = true;
  API.annotations
    .getResolvedAnnotationsApiAnnotationsConfigResolvePost({
      query: {
        assignment_scope_id: assignment_scope_id.value,
        bot_annotation_metadat_id: bot_annotation_metadata_id.value,
        include_empty: true,
        include_new: true,
        update_existing: false,
      },
      body: settings,
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      const { data } = response;
      if (data) freezeCellLabels(data);
      proposal.value = data;
      loadingProposals.value = false;
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
      loadingProposals.value = false;
    });
}

const userLookup = computed<Record<string, DehydratedUser>>(() => platformUsersStore.userLookup);

const filteredOrdering = computed<ResolutionOrdering[]>(() => {
  const ordering = proposal.value?.ordering ?? [];
  const search = itemIdSearch.value;
  return search === "" ? ordering : ordering.filter((entry) => entry.item_id.indexOf(search) >= 0);
});

const labels = computed<Record<string, FlatLabel>>(() => {
  if (!proposal.value) {
    return {};
  }
  return Object.fromEntries(proposal.value.labels.map((label: FlatLabel) => [label.path_key, label]));
});

const isTableReady = computed<boolean>(() => !!proposal.value);

const schemeLookup = computed<Record<string, FlattenedAnnotationSchemeLabel>>(() => {
  if (!annotationScheme.value || !annotationScheme.value.labels) return {};
  return Object.fromEntries(
    annotationScheme.value.labels.map((label: FlattenedAnnotationSchemeLabel) => [label.key, label]),
  );
});

onBeforeRouteLeave(
  () =>
    new Promise<boolean>((resolve) => {
      EventBus.emit(
        new ConfirmationRequestEvent(
          'You will loose data if you have not clicked "save".',
          (confirmationResponse) => {
            const accept = confirmationResponse === "ACCEPT";
            if (accept) {
              clearInterval(saveReminder);
            }
            resolve(accept);
          },
          "Do you really want to leave?",
          "I understand.",
          "Oh right, stop, let me save first.",
        ),
      );
    }),
);
</script>

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
            v-for="orderEntry in filteredOrdering"
            :key="orderEntry.identifier"
            :ordering="orderEntry"
            :row="proposal.matrix[orderEntry.item_id]"
            :user-lookup="userLookup"
            :users="proposal.annotators"
            :label-lookup="labels"
            :labels="proposal.labels"
            :show-text="showText"
            :bot-annotation-meta-data-id="bot_annotation_metadata_id"
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

<style scoped></style>
