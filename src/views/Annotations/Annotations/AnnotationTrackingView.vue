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
              <input id="batch-size" v-model="batchSize" type="number" class="form-control" placeholder="Batch size" />
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
              <ul style="max-height: 10rem" class="list-group overflow-auto">
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
              <ul style="max-height: 10rem" class="list-group overflow-auto">
                <template v-for="source in trackerDetails.source_ids" :key="source">
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
                  <button type="button" class="btn btn-outline-success btn-sm" @click="refreshTracker(false)">
                    <font-awesome-icon :icon="['fas', 'rotate-right']" />
                    Update
                  </button>
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
        <div class="col" v-if="plotData">
          <Line :data="plotData" :options="plotOptions" />
        </div>
        <div class="col" v-if="trackerDetails">
          <ul>
            <li><strong>Number of items:</strong> {{ trackerDetails.n_items_total }}</li>
            <li><strong>Number of labels:</strong> {{ trackerDetails.recall?.length || 0 }}</li>
            <li>
              <strong>Coverage:</strong>
              {{
                ((trackerDetails.recall?.length || 0) / trackerDetails.n_items_total).toLocaleString(undefined, {
                  style: "percent",
                  minimumFractionDigits: 2,
                })
              }}
              of all items labelled.
            </li>
            <li v-if="lastBuscar">
              <strong>Last Buscar score:</strong>
              {{ lastBuscar[1] }}
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
} from "@/plugins/api/api-core";
import { currentProjectStore } from "@/stores";
import { API, ignore } from "@/plugins/api";
import ExpandableBox from "@/components/ExpandableBox.vue";
import ToolTip from "@/components/ToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Point, ChartData, ChartDataset } from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default defineComponent({
  name: "AnnotationTrackingView",
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { ToolTip, ExpandableBox, Line },
  data() {
    return {
      permissions: currentProjectStore.projectPermissions as ProjectPermissionsModel,
      scopes: [] as LabelScope[],
      trackers: [] as DehydratedAnnotationTracker[],
      trackerDetails: null as AnnotationTrackerModel | null,
      batchSize: -1,
    };
  },
  async mounted() {
    API.core.evaluation
      .getProjectTrackersApiEvalTrackingTrackersGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.trackers = response.data;
      })
      .catch(ignore);

    API.core.evaluation
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
        source_ids: [] as string[],
        labels: null,
        recall: null,
        buscar: null,
      };
    },
    saveTracker() {
      if (this.trackerDetails) {
        API.core.evaluation
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
        API.core.evaluation
          .updateTrackerApiEvalTrackingRefreshPost({
            xProjectId: this.trackerDetails.project_id as string,
            trackerId: this.trackerDetails.annotation_tracking_id as string,
            batchSize: this.batchSize > 0 ? this.batchSize : null,
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
        const scopeIndex = this.trackerDetails.source_ids.findIndex((sid) => sid === scope.scope_id);
        this.trackerDetails.source_ids.splice(scopeIndex, 1);
      }
    },
    focus(tracker: DehydratedAnnotationTracker) {
      API.core.evaluation
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
        API.core.evaluation
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
      return this.scopes.filter((scope) => source_ids.indexOf(scope.scope_id) < 0);
    },
    scopesLookup(): Record<string, LabelScope> {
      return Object.fromEntries(this.scopes.map((scope) => [scope.scope_id, scope]));
    },
    plotOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.2,
      };
    },
    plotData(): ChartData<"line", Point[]> | null {
      if (this.trackerDetails) {
        const datasets: ChartDataset<"line", Point[]>[] = [];
        let labels: number[] | undefined = undefined;
        if (this.trackerDetails.recall && this.trackerDetails.recall.length > 0) {
          datasets.push({
            label: "Recall",
            backgroundColor: "#89ee61",
            data: this.trackerDetails.recall.map((entry, idx) => ({ x: idx + 1, y: entry })),
          });
          labels = (this.trackerDetails.recall || []).map((entry, idx) => idx + 1);
        }
        if (this.trackerDetails.buscar && this.trackerDetails.buscar.length > 0) {
          datasets.push({
            label: "Stopping criterion (Buscar)",
            backgroundColor: "#f879e3",
            data: this.trackerDetails.buscar.map((entry) => ({ x: entry[0] + 1, y: entry[1] })),
          });
          if (!labels && this.lastBuscar) {
            labels = [...Array(this.lastBuscar[0])].map((entry, idx) => idx + 1);
          }
        }
        return {
          labels,
          datasets,
        };
      }
      return null;
    },
    lastBuscar(): [number, number | null] | undefined {
      if (this.trackerDetails?.buscar && this.trackerDetails.buscar.length > 0) {
        return this.trackerDetails.buscar[this.trackerDetails.buscar.length - 1] as [number, number | null];
      }
      return undefined;
    },
  },
});
</script>

<style scoped></style>
