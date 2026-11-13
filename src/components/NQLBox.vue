<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { detectIdContext, hintState, type Filter, type IdContext, type IdContextKind, tryParse } from "@/util/nql";
import { isNone, notNone } from "@/util";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import RefreshIcon from "@/components/RefreshIcon.vue";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

type Mode = "txt" | "ind" | "vis";

const emit = defineEmits(["update:query", "update:query-parsed"]);
const props = defineProps({
  query: {
    type: String,
    required: true,
    default: "",
  },
  rows: {
    type: Number,
    required: false,
    default: 5,
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const mode = ref<Mode>("vis");
const queryStr = ref<string>(props.query);
const queryParsed = ref<Filter[]>([]);
const parseError = ref<string | null>(null);
const count = ref<number | null>(null);
// const grammar = ref<string>("");
// const log = ref<string[]>([]);

const hasQueryText = computed<boolean>(() => queryStr.value.trim().length > 0);

const isValid = computed<boolean>(() => !hasQueryText.value || queryParsed.value.length > 0);

function parseQuery(query: string) {
  const outcome = tryParse(query.trim());
  queryParsed.value = outcome.valid ? outcome.results : [];
  parseError.value = outcome.valid ? null : (outcome.error ?? "Invalid query.");
  emit("update:query-parsed", queryParsed.value);
  return queryParsed.value;
}

async function getCount() {
  // Never send a count request for a non-empty but unparseable query — the
  // backend would see an empty filter and count the whole project.
  if (hasQueryText.value && queryParsed.value.length === 0) {
    EventBus.emit(new ToastEvent("WARN", parseError.value ?? "Cannot count items: the query is not valid NQL."));
    throw Error();
  }
  // title:"towards"
  try {
    count.value = (
      await API.search.nqlQueryCountApiSearchNqlCountPost({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        body: queryParsed.value[0],
      })
    ).data;
  } catch {
    EventBus.emit(new ToastEvent("WARN", "Did not receive an item count."));
    throw Error();
  }
}

watch(queryStr, (newQuery) => {
  return parseQuery(newQuery);
});

// Propagate query changes made by the parent into the local state.
// Assigning the same value does not re-trigger the queryStr watch, so no
// update loop occurs when the parent syncs back via v-model / update:query.
watch(
  () => props.query,
  (newQuery) => {
    if (newQuery !== queryStr.value) {
      queryStr.value = newQuery;
    }
  },
);

onMounted(() => {
  if (!isNone(queryStr.value) && queryStr.value.length > 0) {
    parseQuery(queryStr.value);
  }
});

// ── Visual mode: live hints ──────────────────────────────────────────────────
// The hints answer three questions about the text before the caret: where a
// syntax error is, which tokens could legally come next, and — when the caret
// sits in an ID-value context (e.g. after "import:") — which concrete IDs of
// the current project fit there.

const textareaRef = ref<HTMLTextAreaElement | null>(null);
// Start the caret at the end of the query so the hints reflect what the user
// is about to type before they have clicked into the textarea.
const caret = ref<number>(props.query.length);

const hint = computed(() => hintState(queryStr.value, caret.value));

const MAX_CHIPS = 16;
const visibleChips = computed(() => hint.value.chips.slice(0, MAX_CHIPS));
const moreChips = computed(() => Math.max(0, hint.value.chips.length - MAX_CHIPS));
const visibleExpected = computed(() => hint.value.expected.slice(0, 6));

type ListKind = "import" | "scope" | "scheme" | "user";
const LIST_KINDS: ListKind[] = ["import", "scope", "scheme", "user"];

const idContext = computed<IdContext | null>(() => {
  if (!hint.value.ok) return null; // the error banner speaks instead
  return detectIdContext(queryStr.value.slice(0, caret.value), hint.value.wants);
});
const isListContext = computed<boolean>(
  () => !!idContext.value && LIST_KINDS.includes(idContext.value.kind as ListKind),
);

type Suggestion = { id: string; label: string; sub?: string };
const suggestionLists = ref<Partial<Record<ListKind, Suggestion[]>>>({});
const suggestionsLoading = ref<boolean>(false);

async function loadSuggestions(kind: ListKind) {
  if (suggestionLists.value[kind] || suggestionsLoading.value) return;
  suggestionsLoading.value = true;
  const headers = { "x-project-id": currentProjectStore.projectId as string };
  try {
    if (kind === "import") {
      const r = await API.imports.getAllImportsForProjectApiImportsListGet({ headers });
      suggestionLists.value.import = (r.data ?? []).map((i) => ({
        id: String(i.import_id ?? ""),
        label: i.name,
        sub: i.type,
      }));
    } else if (kind === "scope") {
      const r = await API.annotations.getAssignmentScopesForProjectApiAnnotationsAssignmentsScopesGet({ headers });
      suggestionLists.value.scope = (r.data ?? []).map((s) => ({
        id: String(s.assignment_scope_id ?? ""),
        label: s.name,
      }));
    } else if (kind === "scheme") {
      const r = await API.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListGet({ headers });
      suggestionLists.value.scheme = (r.data ?? []).map((s) => ({
        id: String(s.annotation_scheme_id ?? ""),
        label: s.name,
      }));
    } else {
      const r = await API.users.getProjectUsersApiUsersListProjectProjectIdGet({
        headers,
        path: { project_id: headers["x-project-id"] },
      });
      suggestionLists.value.user = (r.data ?? []).map((u) => ({
        id: String(u.user_id ?? ""),
        label: u.full_name || u.username || "unknown user",
        sub: u.username ?? undefined,
      }));
    }
  } catch {
    EventBus.emit(new ToastEvent("WARN", "Could not load ID suggestions."));
  } finally {
    suggestionsLoading.value = false;
  }
}

watch(idContext, (ctx) => {
  if (ctx && LIST_KINDS.includes(ctx.kind as ListKind)) void loadSuggestions(ctx.kind as ListKind);
});

// Drop cached lists when the project changes.
watch(
  () => currentProjectStore.projectId,
  () => {
    suggestionLists.value = {};
  },
);

const suggestions = computed<Suggestion[]>(() => {
  const ctx = idContext.value;
  if (!ctx || !LIST_KINDS.includes(ctx.kind as ListKind)) return [];
  const list = suggestionLists.value[ctx.kind as ListKind] ?? [];
  const p = ctx.partial.toLowerCase();
  const filtered = p ? list.filter((s) => s.id.toLowerCase().includes(p) || s.label.toLowerCase().includes(p)) : list;
  return filtered.filter((s) => s.id.length > 0);
});

const ID_CONTEXT_LABELS: Record<IdContextKind, string> = {
  import: "Project imports — click to add:",
  scope: "Assignment scopes — click to add:",
  scheme: "Annotation schemes — click to add:",
  user: "Project users — click to add:",
  item: "Item IDs are UUIDs: 32 hex characters, or a 2-character short ID.",
  doi: "DOIs look like 10.1000/xyz123 — separate several with commas.",
  openalex: "OpenAlex IDs look like W2741809807.",
};

function updateCaret(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  if (typeof target.selectionStart === "number") caret.value = target.selectionStart;
}

function focusCaret() {
  const el = textareaRef.value;
  if (!el) return;
  el.focus();
  el.setSelectionRange(caret.value, caret.value);
}

/** Insert a hint's text at the caret, adding a separator space when needed. */
function applyInsert(text: string) {
  if (!props.editable) return;
  const before = queryStr.value.slice(0, caret.value);
  const after = queryStr.value.slice(caret.value);
  const needsSpace = /^[A-Za-z(&|]/.test(text) && before.length > 0 && !/[\s([{:,"']$/.test(before);
  const insertion = (needsSpace ? " " : "") + text;
  queryStr.value = before + insertion + after;
  emit("update:query", queryStr.value);
  caret.value = before.length + insertion.length;
  void nextTick(focusCaret);
}

/** Replace the partial ID token at the caret with a picked ID. */
function applySuggestion(suggestion: Suggestion) {
  const ctx = idContext.value;
  if (!ctx || !props.editable) return;
  const start = Math.max(0, caret.value - ctx.partial.length);
  const before = queryStr.value.slice(0, start);
  const after = queryStr.value.slice(caret.value);
  const trimmed = before.trimEnd();
  const separator = trimmed.endsWith(",") ? " " : /[:{[]$/.test(trimmed) ? "" : ", ";
  const next = before + separator + suggestion.id + after;
  queryStr.value = next;
  emit("update:query", next);
  caret.value = start + separator.length + suggestion.id.length;
  void nextTick(focusCaret);
}

function revealError() {
  mode.value = "txt";
  const offset = hint.value.errorOffset ?? caret.value;
  void nextTick(() => {
    const el = textareaRef.value;
    if (!el) return;
    caret.value = offset;
    el.focus();
    el.setSelectionRange(offset, offset);
  });
}

function shortenId(id: string): string {
  return id.length > 14 ? id.slice(0, 8) + "…" + id.slice(-4) : id;
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col">
        <RefreshIcon :refresh="getCount" icon="calculator" class="ms-1" />
        <span v-if="notNone(count)" class="small text-muted ms-2">{{ (count ?? 0).toLocaleString() }}</span>
      </div>
      <div class="col text-end">
        <a
          href="https://nacsos.pik-potsdam.de/documentation/user/data-queries/"
          target="_blank"
          class="link-secondary me-2"
          style="text-decoration: none"
          rel="noopener noreferrer"
        >
          <font-awesome-icon :icon="['fas', 'circle-question']" />
          NQL Help</a
        >
        <span class="border rounded-2 p-1">
          <button
            type="button"
            class="btn btn-sm p-1 border-0"
            :class="mode === 'txt' ? 'btn-secondary' : 'btn-light text-muted'"
            aria-label="Plain text query"
            title="Plain text query"
            @click="mode = 'txt'"
          >
            <font-awesome-icon :icon="['fas', 'align-left']" />
          </button>
          <button
            type="button"
            class="btn btn-sm p-1 border-0"
            :class="mode === 'ind' ? 'btn-secondary' : 'btn-light text-muted'"
            aria-label="Indented query view"
            title="Indented query view"
            @click="mode = 'ind'"
          >
            <font-awesome-icon :icon="['fas', 'indent']" />
          </button>
          <button
            type="button"
            class="btn btn-sm p-1 border-0"
            :class="mode === 'vis' ? 'btn-secondary' : 'btn-light text-muted'"
            aria-label="Visual query hints"
            title="Visual query hints"
            @click="mode = 'vis'"
          >
            <font-awesome-icon :icon="['fas', 'tags']" />
          </button>
        </span>
      </div>
    </div>

    <!-- TEXT MODE -->
    <div v-if="mode === 'txt'" class="row g-0">
      <div class="col">
        <textarea
          ref="textareaRef"
          v-model="queryStr"
          @input="$emit('update:query', $event.target.value)"
          aria-label="NQL query"
          class="form-control text-muted"
          style="font-family: monospace"
          :class="{ 'is-invalid': !isValid }"
          :disabled="!editable"
          :rows="rows"
        />
        <div class="invalid-feedback">{{ parseError ?? "This is not a valid NQL query (yet)." }}</div>
      </div>
    </div>

    <!-- INDENT MODE -->
    <div class="row border rounded-2 p-2 mt-1" v-else-if="mode === 'ind'">Parsed view not implemented, yet.</div>

    <!-- VISUAL MODE -->
    <div v-else-if="mode === 'vis'" class="row g-0">
      <div class="col">
        <textarea
          ref="textareaRef"
          v-model="queryStr"
          @input="$emit('update:query', $event.target.value)"
          @click="updateCaret"
          @keyup="updateCaret"
          @focus="updateCaret"
          aria-label="NQL query"
          class="form-control text-muted"
          style="font-family: monospace"
          :class="{ 'is-invalid': !isValid }"
          :disabled="!editable"
          :rows="5"
        />

        <!-- Syntax error location -->
        <div
          v-if="hasQueryText && !hint.ok"
          class="alert alert-danger py-1 px-2 mt-2 d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span class="small">
            <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="me-1" />
            Syntax error at position {{ (hint.errorOffset ?? caret) + 1 }}.
          </span>
          <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" @click="revealError">
            Edit at error
          </button>
        </div>
        <div v-else-if="hint.complete" class="mt-2">
          <span class="badge text-bg-success">
            <font-awesome-icon :icon="['fas', 'circle-check']" class="me-1" />
            Valid query
          </span>
        </div>

        <!-- What can come next -->
        <div v-if="hint.ok && visibleChips.length" class="mt-2 small">
          <span class="text-muted me-1">Expected next:</span>
          <button
            v-for="chip in visibleChips"
            :key="chip.label"
            type="button"
            class="btn btn-sm btn-outline-secondary py-0 px-1 me-1 mb-1 font-monospace"
            :disabled="!editable"
            @click="applyInsert(chip.insert)"
          >
            {{ chip.label }}
          </button>
          <span v-if="moreChips > 0" class="text-muted">+{{ moreChips }} more</span>
        </div>
        <div v-if="hint.ok && visibleExpected.length" class="small text-muted mt-1">
          expects <span class="font-monospace">{{ visibleExpected.join(", ") }}</span>
        </div>

        <!-- Concrete IDs for the current context -->
        <div v-if="idContext" class="mt-2 border-top pt-2">
          <div class="small text-muted mb-1">{{ ID_CONTEXT_LABELS[idContext.kind] }}</div>
          <template v-if="isListContext">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              type="button"
              class="btn btn-sm btn-outline-primary py-0 px-2 me-1 mb-1"
              :disabled="!editable"
              @click="applySuggestion(suggestion)"
            >
              {{ suggestion.label }}
              <span class="font-monospace text-muted small">{{ shortenId(suggestion.id) }}</span>
            </button>
            <div v-if="suggestionsLoading" class="small text-muted">Loading suggestions…</div>
            <div v-else-if="!suggestions.length" class="small text-muted fst-italic">No matching entries.</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
