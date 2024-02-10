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
        <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="onlyMean = !onlyMean">
          <font-awesome-icon :icon="['fas', 'user-tag']" />
        </button>

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
        <table class="table" style="table-layout: fixed">
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
            <template v-for="(labelMetric, key) in nestedMetric" :key="key">
              <tr v-if="labelMetric.MEAN" class="table-success">
                <td>{{ key }}</td>
                <td v-if="visibleColumns.cohen">{{ prettyNum(labelMetric.MEAN.cohen) }}</td>
                <td v-if="visibleColumns.fleiss">{{ prettyNum(labelMetric.MEAN.fleiss) }}</td>
                <td v-if="visibleColumns.randolph">{{ prettyNum(labelMetric.MEAN.randolph) }}</td>
                <td v-if="visibleColumns.krippendorff">{{ prettyNum(labelMetric.MEAN.krippendorff) }}</td>
                <td v-if="visibleColumns.pearson">
                  {{ prettyNum(labelMetric.MEAN.pearson) }}
                  <span class="text-muted small" v-if="labelMetric.MEAN.pearson_p">
                    (p={{ prettyNum(labelMetric.MEAN.pearson_p) }})
                  </span>
                </td>
                <td v-if="visibleColumns.kendall">
                  {{ prettyNum(labelMetric.MEAN.kendall) }}
                  <span class="text-muted small" v-if="labelMetric.MEAN.kendall_p">
                    (p={{ prettyNum(labelMetric.MEAN.kendall_p) }})
                  </span>
                </td>
                <td v-if="visibleColumns.spearman">
                  {{ prettyNum(labelMetric.MEAN.spearman) }}
                  <span class="text-muted small" v-if="labelMetric.MEAN.spearman">
                    (p={{ prettyNum(labelMetric.MEAN.spearman) }})
                  </span>
                </td>
                <td v-if="visibleColumns.precision">{{ prettyNum(labelMetric.MEAN.precision) }}</td>
                <td v-if="visibleColumns.recall">{{ prettyNum(labelMetric.MEAN.recall) }}</td>
                <td v-if="visibleColumns.f1">{{ prettyNum(labelMetric.MEAN.f1) }}</td>
                <td v-if="visibleColumns.multi_overlap_mean">
                  {{ prettyNum(labelMetric.MEAN.multi_overlap_mean) }}
                  <span class="text-muted small" v-if="labelMetric.MEAN.multi_overlap_std">
                    (&sigma;={{ prettyNum(labelMetric.MEAN.multi_overlap_std) }})
                  </span>
                </td>
                <td v-if="visibleColumns.multi_overlap_median">
                  {{ prettyNum(labelMetric.MEAN.multi_overlap_median) }}
                </td>
                <td v-if="visibleColumns.num_agreement">
                  <font-awesome-icon :icon="['far', 'circle-check']" />
                  {{ prettyNum(labelMetric.MEAN.num_agree) }}
                  <font-awesome-icon :icon="['far', 'circle-xmark']" class="ms-2" />
                  {{ prettyNum(labelMetric.MEAN.num_disagree) }}
                  <span class="text-muted small" v-if="labelMetric.MEAN.perc_agree">
                    ({{ prettyNum(labelMetric.MEAN.perc_agree) }}%)
                  </span>
                </td>
                <td v-if="visibleColumns.num_overlap">
                  {{ prettyNum(labelMetric.MEAN.num_overlap) }}/{{ prettyNum(labelMetric.MEAN.num_items) }}
                </td>
              </tr>
              <template v-if="!onlyMean">
                <template v-for="userMetric in labelMetric.USERS" :key="userMetric.annotation_quality_id as string">
                  <tr>
                    <td class="table-success small">
                      {{ userMetric.user_base }}
                      &rarr;
                      {{ userMetric.user_target }}
                      <span
                        class="text-muted ms-2 p-1"
                        :class="{ 'bg-success': userMetric.annotation_quality_id === focusedMetric }"
                        role="button"
                        @click="toggleAnnotations(userMetric.annotation_quality_id as string)"
                      >
                        <font-awesome-icon :icon="['fas', 'tags']" />
                      </span>
                    </td>

                    <td v-if="visibleColumns.cohen">{{ prettyNum(userMetric.cohen) }}</td>
                    <td v-if="visibleColumns.fleiss">{{ prettyNum(userMetric.fleiss) }}</td>
                    <td v-if="visibleColumns.randolph">{{ prettyNum(userMetric.randolph) }}</td>
                    <td v-if="visibleColumns.krippendorff">{{ prettyNum(userMetric.krippendorff) }}</td>
                    <td v-if="visibleColumns.pearson">
                      {{ prettyNum(userMetric.pearson) }}
                      <span class="text-muted small" v-if="userMetric.pearson_p">
                        (p={{ prettyNum(userMetric.pearson_p) }})
                      </span>
                    </td>
                    <td v-if="visibleColumns.kendall">
                      {{ prettyNum(userMetric.kendall) }}
                      <span class="text-muted small" v-if="userMetric.kendall_p">
                        (p={{ prettyNum(userMetric.kendall_p) }})
                      </span>
                    </td>
                    <td v-if="visibleColumns.spearman">
                      {{ prettyNum(userMetric.spearman) }}
                      <span class="text-muted small" v-if="userMetric.spearman">
                        (p={{ prettyNum(userMetric.spearman) }})
                      </span>
                    </td>
                    <td v-if="visibleColumns.precision">{{ prettyNum(userMetric.precision) }}</td>
                    <td v-if="visibleColumns.recall">{{ prettyNum(userMetric.recall) }}</td>
                    <td v-if="visibleColumns.f1">{{ prettyNum(userMetric.f1) }}</td>
                    <td v-if="visibleColumns.multi_overlap_mean">
                      {{ prettyNum(userMetric.multi_overlap_mean) }}
                      <span class="text-muted small" v-if="userMetric.multi_overlap_std">
                        (&sigma;={{ prettyNum(userMetric.multi_overlap_std) }})
                      </span>
                    </td>
                    <td v-if="visibleColumns.multi_overlap_median">
                      {{ prettyNum(userMetric.multi_overlap_median) }}
                    </td>
                    <td v-if="visibleColumns.num_agreement">
                      <font-awesome-icon :icon="['far', 'circle-check']" />
                      {{ prettyNum(userMetric.num_agree) }}
                      <font-awesome-icon :icon="['far', 'circle-xmark']" class="ms-2" />
                      {{ prettyNum(userMetric.num_disagree) }}
                      <span class="text-muted small" v-if="userMetric.perc_agree">
                        ({{ prettyNum(userMetric.perc_agree) }}%)
                      </span>
                    </td>
                    <td v-if="visibleColumns.num_overlap">
                      {{ prettyNum(userMetric.num_overlap) }}/{{ prettyNum(userMetric.num_items) }}
                    </td>
                  </tr>
                  <tr v-if="focusedMetric == userMetric.annotation_quality_id">
                    <td
                      :colspan="Object.values(visibleColumns).reduce((cnt, c) => cnt + (c ? 1 : 0), 0)"
                      class="overflow-x-auto"
                    >
                      <div class="d-flex justify-content-start small">
                        <div v-for="(base, i) in userMetric.annotations_base" :key="i" class="d-flex flex-column me-1">
                          <div class="p-1 text-nowrap">
                            {{ prettyAnno(base) }}
                          </div>
                          <div
                            v-if="userMetric.annotations_target"
                            class="p-1 text-nowrap"
                            :class="annotationMatchBackground(base, userMetric.annotations_target[i])"
                          >
                            {{ prettyAnno(userMetric.annotations_target[i]) }}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </template>
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
import { isArray, isNone, notNone } from '@/util';

type MetricLabelLookup = {
  MEAN: AnnotationQualityModel | null;
  USERS: AnnotationQualityModel[];
  LABELS: Record<number, AnnotationQualityModel[]> | null;
};
type MetricLookup = Record<string, MetricLabelLookup>;

export default defineComponent({
  name: "ScopeQuality",
  components: { AssignmentsVisualiser },
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
              lkpLabels[metric.label_value as number] = [];
            }
            lkpLabels[metric.label_value as number].push(metric);
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
