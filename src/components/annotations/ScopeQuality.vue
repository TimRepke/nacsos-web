<template>
  <div>
    <div class="d-flex flex-nowrap bg-secondary bg-opacity-10 mt-1 mb-1">
      <div class="flex-grow-1 ms-2">
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="focus()">
          <font-awesome-icon :icon="['fas', 'eye']" />
        </button>
        {{ scope.name }}
      </div>
      <div class="text-muted me-4 pe-4 border-end border-dark" v-if="scope.time_created">
        Created: {{ scope.time_created.substring(0, 10) }}
      </div>
      <div class="me-2" v-if="counts">
        <span
          class="text-muted me-2 p-2"
          :class="{ 'bg-success': assignmentsVisible }"
          role="button"
          @click="toggleAssignments"
        >
          <font-awesome-icon :icon="['fas', 'list-check']" />
        </span>
        <span>Assignments: {{ counts.num_total }}</span> ( open:
        <span class="bg-info bg-opacity-50 p-1">{{ counts.num_open }}</span> | partial:
        <span class="bg-warning bg-opacity-50 p-1">{{ counts.num_partial }}</span> | done:
        <span class="bg-success bg-opacity-50 p-1">{{ counts.num_full }}</span>
        )
      </div>
    </div>

    <div v-if="assignmentsVisible && assignments">
      <AssignmentsVisualiser :assignment-entries="assignments" />
    </div>

    <div v-if="inFocus">
      <div class="d-flex justify-content-end">
        <div class="position-relative">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="pickColumns = !pickColumns">
            <font-awesome-icon icon="table-columns" />
          </button>

          <div
            v-show="pickColumns"
            class="popover bs-popover-auto fade show position-absolute"
            role="tooltip"
            style="inset: 0 auto auto 0; margin: 0; transform: translate(calc(-100% - 10px), -20px)"
            data-popper-placement="left"
          >
            <div class="popover-arrow" style="position: absolute; top: 0; transform: translate(0px, 20px)"></div>
            <div class="popover-body">
              <div class="form-check form-switch" v-for="(active, key) in visibleColumns" :key="key">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  :id="`column-check-${key}`"
                  v-model="visibleColumns[key]"
                />
                <label class="form-check-label" :for="`column-check-${key}`">{{ key }}</label>
              </div>
            </div>
          </div>
        </div>

        <select class="form-select form-select-sm w-auto me-2" v-model="selected_resolution">
          <option :value="null">Include no resolution</option>
          <option
            v-for="resolution in resolutions"
            :key="resolution.bot_annotation_metadata_id as string"
            :value="resolution.bot_annotation_metadata_id as string"
          >
            {{ resolution.name }}
          </option>
        </select>

        <button type="button" class="btn btn-sm btn-outline-warning" @click="recomputeMetric">
          <font-awesome-icon :icon="['fas', 'calculator']" />
          (Re)compute
        </button>
      </div>
      <template v-if="nestedMetric">
        <table class="table table-sm table-hover" style="table-layout: fixed">
          <thead>
            <tr>
              <th>Label</th>
              <th v-if="visibleColumns.cohen">Cohen</th>
              <th v-if="visibleColumns.fleiss">Fleiss</th>
              <th v-if="visibleColumns.randolph">Randolph</th>
              <th v-if="visibleColumns.krippendorff">Krippendorff</th>
              <th v-if="visibleColumns.pearson">Pearson</th>
              <th v-if="visibleColumns.kendall">Kendall</th>
              <th v-if="visibleColumns.spearman">Spearman</th>
              <th v-if="visibleColumns.precision">Precision</th>
              <th v-if="visibleColumns.recall">Recall</th>
              <th v-if="visibleColumns.f1">F1</th>
              <th v-if="visibleColumns.multi_overlap_mean">Multi overlap (mean)</th>
              <th v-if="visibleColumns.multi_overlap_median">Multi overlap (median)</th>
              <th v-if="visibleColumns.num_agreement">Agreement</th>
              <th v-if="visibleColumns.num_overlap">Item overlap</th>
            </tr>
          </thead>
          <tbody>
            <ScopeQualityEntry
              v-for="(labelMetric, key) in nestedMetric"
              :key="key"
              :quality="labelMetric.MEAN"
              :user-qualities="labelMetric.USERS"
              :choice-qualities="labelMetric.LABELS"
            />
          </tbody>
        </table>
      </template>
      <template v-else>
        <div class="ms-4">
          <font-awesome-icon :icon="['fas', 'oil-well']" />
          No Metric available (yet).
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type {
  AnnotationQualityModel,
  AssignmentCounts,
  AssignmentScopeEntry,
  BotAnnotationMetaDataBaseModel,
} from "@/plugins/api/api-core";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { API, ignore, toastReject } from "@/plugins/api";
import type { AssignmentScopeModel } from "@/plugins/api/api-core";
import AssignmentsVisualiser from "@/components/annotations/assignments/AssignmentsVisualiser.vue";
import { isArray, isNone } from "@/util";
import ScopeQualityEntry from "@/components/annotations/ScopeQualityEntry.vue";

type MetricLabelLookup = {
  MEAN: AnnotationQualityModel | null;
  USERS: AnnotationQualityModel[];
  LABELS: Record<number, { MEAN: AnnotationQualityModel | null; USERS: AnnotationQualityModel[] }> | null;
};
type MetricLookup = Record<string, MetricLabelLookup>;

export default defineComponent({
  name: "ScopeQuality",
  components: { ScopeQualityEntry, AssignmentsVisualiser },
  props: {
    scope: {
      type: Object as PropType<AssignmentScopeModel>,
      required: true,
    },
  },
  data() {
    return {
      inFocus: false,
      assignmentsVisible: false,
      onlyMean: true,
      focusedMetric: null as null | string,
      counts: null as AssignmentCounts | null,
      Metric: null as Array<AnnotationQualityModel> | null,
      assignments: null as Array<AssignmentScopeEntry> | null,
      resolutions: [] as Array<BotAnnotationMetaDataBaseModel>,
      selected_resolution: null as string | null | undefined,
      visibleColumns: interfaceSettingsStore.qualityColumns,
      pickColumns: false,
    };
  },
  async mounted() {
    API.core.annotations
      .getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
        xProjectId: currentProjectStore.projectId as string,
        assignmentScopeId: this.scope.assignment_scope_id as string,
      })
      .then((response) => {
        this.counts = response.data;
      })
      .catch(ignore);
  },
  methods: {
    prettyNum(v: number | null | undefined): string {
      if (isNone(v)) return "—";
      return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
    },
    prettyAnno(v: number | null | undefined): string | number {
      if (isNone(v)) return "–";
      return v;
    },
    annotationMatchBackground(
      v1: number[] | number | null | undefined,
      v2: number[] | number | null | undefined,
    ): string {
      if (isNone(v1) && isNone(v2)) return "";
      if (isArray(v1) && JSON.stringify(v1) === JSON.stringify(v1)) return "bg-success";
      if (v1 === v2) return "bg-success";
      if (isNone(v1) || isNone(v2)) return "bg-warning";
      return "bg-danger";
    },
    toggleAnnotations(annotation_quality_id: string) {
      if (annotation_quality_id !== this.focusedMetric) this.focusedMetric = annotation_quality_id;
      else this.focusedMetric = null;
    },
    focus() {
      if (!this.inFocus) {
        if (this.Metric === null) {
          this.loadMetric();
        }
        if (this.resolutions.length === 0) {
          API.core.evaluation
            .getResolutionsForScopeApiEvalResolutionsGet({
              assignmentScopeId: this.scope.assignment_scope_id as string,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then((response) => {
              this.resolutions = response.data;
            })
            .catch(toastReject);
        }
      }
      this.inFocus = !this.inFocus;
    },
    loadMetric() {
      API.core.evaluation
        .getIrrApiEvalQualityLoadAssignmentScopeIdGet({
          assignmentScopeId: this.scope.assignment_scope_id as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.Metric = response.data;

          // select the last used resolution
          if (this.Metric) {
            this.selected_resolution = this.Metric[0].bot_annotation_metadata_id;
          }
        })
        .catch(toastReject);
    },
    recomputeMetric() {
      API.core.evaluation
        .recomputeIrrApiEvalQualityComputeGet({
          assignmentScopeId: this.scope.assignment_scope_id as string,
          botAnnotationMetadataId: this.selected_resolution,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.Metric = response.data;
        })
        .catch(toastReject);
    },
    toggleAssignments() {
      this.assignmentsVisible = !this.assignmentsVisible;
      if (!this.assignments) {
        API.core.annotations
          .getAssignmentIndicatorsForScopeApiAnnotationsAnnotateAssignmentProgressAssignmentScopeIdGet({
            xProjectId: currentProjectStore.projectId as string,
            assignmentScopeId: this.scope.assignment_scope_id as string,
          })
          .then(async (response) => {
            this.assignments = response.data;
          })
          .catch(toastReject);
      }
    },
  },
  computed: {
    nestedMetric(): MetricLookup | undefined {
      if (this.Metric && this.Metric.length > 0) {
        const lookup: MetricLookup = {};
        this.Metric.forEach((metric: AnnotationQualityModel) => {
          const key = metric.label_key as string;
          if (!(key in lookup)) {
            lookup[key] = { MEAN: null, USERS: [], LABELS: null } as MetricLabelLookup;
          }
          if (!metric.user_base && !metric.user_target && isNone(metric.label_value)) {
            lookup[key].MEAN = metric;
          } else if (!isNone(metric.label_value)) {
            let lkpLabels = lookup[key].LABELS;
            if (lkpLabels === null) {
              lkpLabels = {};
            }
            if (!(metric.label_value in lkpLabels)) {
              lkpLabels[metric.label_value as number] = { MEAN: null, USERS: [] };
            }
            if (!metric.user_base && !metric.user_target) {
              lkpLabels[metric.label_value as number].MEAN = metric;
            } else {
              lkpLabels[metric.label_value as number].USERS.push(metric);
            }
            lookup[key].LABELS = lkpLabels;
          } else {
            lookup[key].USERS.push(metric);
          }
        });
        return lookup;
      }
      return undefined;
    },
  },
});
</script>

<style scoped></style>
