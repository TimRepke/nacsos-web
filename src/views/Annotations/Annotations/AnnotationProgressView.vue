<template>
  <div>
    <h2>Annotation Progress Monitor</h2>
    <div class="row mb-4">
      <div class="col">
        <ul v-if="trackers.length > 0">
          <li v-for="tracker in trackers" :key="tracker.annotation_tracking_id as string">
            {{ tracker.name }}
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="focus(tracker)">
              <font-awesome-icon :icon="['fas', 'eye']" />
            </button>
          </li>
        </ul>
        <div v-else>Loading trackers for this project (or none found)...</div>
      </div>

      <div class="col">
        <div class="d-flex justify-content-end">
          <button type="button" @click="addTracker" class="btn btn-outline-secondary btn-sm me-4">
            <font-awesome-icon :icon="['far', 'square-plus']" />
            Add tracker
          </button>
        </div>
      </div>
    </div>

    <template v-if="trackerDetails">
      <ExpandableBox :initially-open="false" v-if="permissions.annotations_edit">
        <template v-slot:head>
          <strong>Settings</strong>
          &nbsp;for
          <span class="text-muted ms-2"> "{{ trackerDetails.name }}"</span>
        </template>
        <template v-slot:body>
          <div class="row">
            <div class="col">
              <div class="text-end">
                <button type="button" class="btn btn-danger btn-sm me-2" @click="deleteTracker()">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                  Delete
                </button>
                <button type="button" class="btn btn-success btn-sm" @click="saveTracker()">
                  <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                  Save
                </button>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-5">
              <label for="tracker-name" class="form-label"> Tracker name </label>
              <input
                id="tracker-name"
                v-model="trackerDetails.name"
                type="text"
                class="form-control"
                placeholder="Tracker name"
              />
            </div>
            <div class="col">
              <label for="recall-target" class="form-label">
                Recall target
                <ToolTip> Float between 0.0–1.0; default is 0.95 (=95% recall).</ToolTip>
              </label>
              <input
                id="recall-target"
                v-model="trackerDetails.recall_target"
                type="number"
                class="form-control"
                placeholder="Tracker name"
              />
            </div>
            <div class="col">
              <label for="num-items" class="form-label">
                Number of items
                <ToolTip>
                  We need a reference what your overall total number of items refers to. This might not always be the
                  number of documents in the project, so we do not pre-fill this value. Please add the proper value
                  yourself.
                </ToolTip>
              </label>
              <input
                id="num-items"
                v-model="trackerDetails.n_items_total"
                type="number"
                class="form-control"
                placeholder="Number of items"
              />
            </div>
            <div class="col">
              <label for="batch-size" class="form-label">
                Batch size
                <ToolTip>
                  The stopping criterion will be calculated after every batch of documents. If this is >0, the score is
                  calculated after each batch of annotations (assignment scope or resolution).
                </ToolTip>
              </label>
              <input
                id="batch-size"
                v-model="trackerDetails.batch_size"
                type="number"
                class="form-control"
                placeholder="Batch size"
              />
            </div>
            <div class="col-3">
              <label for="inclusion-rule" class="form-label">
                Inclusion rule
                <ToolTip>
                  Specify the logic to be assumed for a document to be included. For example if you have a label "rel"
                  and documents are relevant when this is set to 1, then leave it as "rel=1". You may also have more
                  complex schemes, such as "rel=1 OR (pricing=1 AND country=1)".
                </ToolTip>
              </label>
              <input
                id="inclusion-rule"
                v-model="trackerDetails.inclusion_rule"
                type="text"
                class="form-control"
                placeholder="Inclusion rule"
              />
            </div>
          </div>

          <div class="row mb-2">
            <div class="col">
              Project scopes
              <ul style="max-height: 15rem" class="list-group overflow-auto">
                <li
                  v-for="scope in availableScopes"
                  :key="scope.scope_id"
                  class="list-group-item d-flex justify-content-between align-items-start text-muted"
                >
                  <div class="me-auto">
                    <font-awesome-icon :icon="['fas', scope.scope_type === 'H' ? 'user' : 'user-check']" />
                    {{ scope.name }}
                  </div>
                  <span role="button" class="link-secondary" tabindex="0" @click="addScope(scope)">
                    <font-awesome-icon :icon="['fas', 'file-circle-plus']" />
                  </span>
                </li>
              </ul>
            </div>
            <div class="col">
              Selected scopes
              <ToolTip>The order of scopes does matter!</ToolTip>
              <ul style="max-height: 15rem" class="list-group overflow-auto">
                <template v-for="(source, si) in trackerDetails.source_ids" :key="source">
                  <li
                    v-if="scopesLookup[source]"
                    class="list-group-item d-flex justify-content-between align-items-start text-muted"
                  >
                    <div class="me-auto">
                      <font-awesome-icon
                        :icon="['fas', scopesLookup[source].scope_type === 'H' ? 'user' : 'user-check']"
                      />
                      {{ scopesLookup[source].name }}
                    </div>
                    <span role="button" class="link-secondary" tabindex="0" @click="moveScopeUp(si)">
                      <font-awesome-icon :icon="['fas', 'arrow-up']" />
                    </span>
                    <span role="button" class="link-secondary me-2" tabindex="0" @click="moveScopeDown(si)">
                      <font-awesome-icon :icon="['fas', 'arrow-down']" />
                    </span>
                    <span role="button" class="link-secondary" tabindex="0" @click="dropScope(scopesLookup[source])">
                      <font-awesome-icon :icon="['fas', 'file-circle-minus']" />
                    </span>
                  </li>
                </template>
              </ul>
            </div>
          </div>

          <div class="row mb-2" v-if="trackerDetails.time_created">
            <div class="col">
              <div class="d-flex justify-content-end">
                <div class="me-4 text-muted small">
                  Created: {{ trackerDetails.time_created }}<br />
                  Updated: {{ trackerDetails.time_updated }}
                </div>
                <div>
                  <button type="button" class="btn btn-outline-warning btn-sm me-2" @click="refreshTracker(true)">
                    <font-awesome-icon :icon="['fas', 'rotate']" />
                    Reset
                  </button>
                  <!--<button type="button" class="btn btn-outline-success btn-sm" @click="refreshTracker(false)">-->
                  <!--  <font-awesome-icon :icon="['fas', 'rotate-right']" />-->
                  <!--  Update-->
                  <!--</button>-->
                </div>
              </div>
            </div>
          </div>
        </template>
      </ExpandableBox>

      <div class="row mt-2">
        <div class="col">
          <div class="d-flex justify-content-end">
            <button type="button" @click="refresh()" class="btn btn-outline-secondary btn-sm me-4">
              <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col" v-if="trackerDetails">
          <BuscarChart
            :buscar="trackerDetails.buscar"
            :labels="trackerDetails.labels"
            :recall="trackerDetails.recall"
          />
        </div>
        <div class="col" v-if="trackerDetails">
          <ul>
            <li><strong>Number of items:</strong> {{ trackerDetails.n_items_total }}</li>
            <li>
              <strong>Number of screened:</strong> {{ numLabels }} ({{ numLabelsPos }} incl,
              {{ numLabels - numLabelsPos }} excl)
            </li>
            <li>
              <strong>Coverage:</strong>
              {{
                (numLabels / trackerDetails.n_items_total).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })
              }}
              of all items labelled.
            </li>
            <li v-if="lastBuscar">
              <strong>Last Buscar score:</strong>
              {{ lastBuscar[1] }}
              <ToolTip>
                This is the p-score for the null-hypothesis that we've seen at least
                {{ trackerDetails.recall_target * 100 }}% of all relevant documents in the corpus. In other words, you
                could say you've seen {{ (1 - (lastBuscar[1] || 1)) * 100 }}% all all relevant documents.
              </ToolTip>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type {
  AnnotationTrackerModel,
  DehydratedAnnotationTracker,
  LabelScope,
  ProjectPermissionsModel,
} from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import { API, ignore } from "@/plugins/api";
import ExpandableBox from "@/components/ExpandableBox.vue";
import ToolTip from "@/components/ToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import BuscarChart from "@/components/charts/BuscarChart.vue";

export default defineComponent({
  name: "AnnotationTrackingView",
  components: { BuscarChart, ToolTip, ExpandableBox },
  data() {
    return {
      permissions: currentProjectStore.permissions as ProjectPermissionsModel,
      scopes: [] as LabelScope[],
      trackers: [] as DehydratedAnnotationTracker[],
      trackerDetails: null as AnnotationTrackerModel | null,
    };
  },
  async mounted() {
    API.evaluation
      .getProjectTrackersApiEvalTrackingTrackersGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.trackers = response.data;
      })
      .catch(ignore);

    API.evaluation
      .getProjectScopesApiEvalTrackingScopesGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.scopes = response.data;
      })
      .catch(ignore);
  },
  methods: {
    addTracker() {
      this.trackerDetails = {
        annotation_tracking_id: null,
        name: "New Tracker",
        project_id: currentProjectStore.projectId as string,
        inclusion_rule: "rel=1",
        majority: true,
        n_items_total: 0,
        recall_target: 0.95,
        batch_size: 100,
        source_ids: [] as string[],
        labels: null,
        recall: null,
        buscar: null,
      };
    },
    saveTracker() {
      if (this.trackerDetails) {
        API.evaluation
          .saveTrackerApiEvalTrackingTrackerPut({
            xProjectId: currentProjectStore.projectId as string,
            requestBody: this.trackerDetails,
          })
          .then((response) => {
            if (this.trackerDetails) {
              this.trackerDetails.annotation_tracking_id = response.data;
            }
            EventBus.emit(new ToastEvent("SUCCESS", `Saved with id ${response.data}.`));
          })
          .catch(ignore);
      } else {
        EventBus.emit(new ToastEvent("WARN", "Nothing to save."));
      }
    },
    deleteTracker() {
      // TODO
    },
    refreshTracker(reset: boolean) {
      if (this.trackerDetails) {
        API.evaluation
          .updateTrackerApiEvalTrackingRefreshPost({
            xProjectId: this.trackerDetails.project_id as string,
            trackerId: this.trackerDetails.annotation_tracking_id as string,
            reset,
          })
          .then((response) => {
            if (this.trackerDetails) {
              this.trackerDetails = response.data;
              EventBus.emit(new ToastEvent("INFO", "Tracker will be updated and/or recomputed."));
            }
          })
          .catch(ignore);
      } else {
        EventBus.emit(new ToastEvent("WARN", "No tracker loaded."));
      }
    },
    addScope(scope: LabelScope) {
      if (this.trackerDetails) {
        this.trackerDetails.source_ids?.push(scope.scope_id);
      }
    },
    dropScope(scope: LabelScope) {
      if (this.trackerDetails && this.trackerDetails.source_ids) {
        const scopeIndex = this.trackerDetails.source_ids.findIndex((sid: string) => sid === scope.scope_id);
        this.trackerDetails.source_ids.splice(scopeIndex, 1);
      }
    },
    moveScopeUp(si: number) {
      if (this.trackerDetails && this.trackerDetails.source_ids && si > 0) {
        const tmp = this.trackerDetails.source_ids[si];
        this.trackerDetails.source_ids[si] = this.trackerDetails.source_ids[si - 1];
        this.trackerDetails.source_ids[si - 1] = tmp;
      }
    },
    moveScopeDown(si: number) {
      if (this.trackerDetails && this.trackerDetails.source_ids && si < this.trackerDetails.source_ids.length - 1) {
        const tmp = this.trackerDetails.source_ids[si];
        this.trackerDetails.source_ids[si] = this.trackerDetails.source_ids[si + 1];
        this.trackerDetails.source_ids[si + 1] = tmp;
      }
    },
    focus(tracker: DehydratedAnnotationTracker) {
      API.evaluation
        .getTrackerApiEvalTrackingTrackerTrackerIdGet({
          xProjectId: currentProjectStore.projectId as string,
          trackerId: tracker.annotation_tracking_id as string,
        })
        .then((response) => {
          this.trackerDetails = response.data;
        })
        .catch(ignore);
    },
    refresh() {
      if (this.trackerDetails) {
        API.evaluation
          .getTrackerApiEvalTrackingTrackerTrackerIdGet({
            xProjectId: currentProjectStore.projectId as string,
            trackerId: this.trackerDetails.annotation_tracking_id as string,
          })
          .then((response) => {
            this.trackerDetails = response.data;
          })
          .catch(ignore);
      }
    },
  },
  computed: {
    availableScopes() {
      const source_ids = this.trackerDetails?.source_ids;
      if (!source_ids) return this.scopes;
      return this.scopes.filter((scope: LabelScope) => source_ids.indexOf(scope.scope_id) < 0);
    },
    scopesLookup(): Record<string, LabelScope> {
      return Object.fromEntries(this.scopes.map((scope: LabelScope) => [scope.scope_id, scope]));
    },
    lastBuscar(): [number, number | null] | undefined {
      if (this.trackerDetails?.buscar && this.trackerDetails.buscar.length > 0) {
        return this.trackerDetails.buscar[this.trackerDetails.buscar.length - 1] as [number, number | null];
      }
      return undefined;
    },
    numLabels(): number {
      return (this.trackerDetails?.recall || []).length;
    },
    numLabelsPos(): number {
      return (this.trackerDetails?.labels || []).reduce((countTotal: number, labels: number[]) => {
        return countTotal + labels.reduce((count: number, label: number) => count + label, 0);
      }, 0);
    },
  },
});
</script>

<style scoped></style>
