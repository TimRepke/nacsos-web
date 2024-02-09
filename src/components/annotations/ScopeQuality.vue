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

        <button type="button" class="btn btn-sm btn-outline-warning" @click="recomputeMetrics">
          <font-awesome-icon :icon="['fas', 'calculator']" />
          (Re)compute
        </button>
      </div>
      <template v-if="nestedMetrics">
        <table class="table" style="table-layout: fixed">
          <thead>
            <tr>
              <th>Label</th>
              <th>Cohen</th>
              <th>Fleiss</th>
              <th>Randolph</th>
              <th>Krippendorff</th>
              <th>Pearson</th>
              <th>Kendall</th>
              <th>Spearman</th>
              <th>Overlap</th>
              <th>Agreement</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(labelMetrics, path_key) in nestedMetrics" :key="path_key">
              <tr v-if="labelMetrics.MEAN" class="table-success">
                <td>
                  <LabelPathPills :label="[(labelMetrics.MEAN.label_path as Label[])[0]]"></LabelPathPills>
                </td>
                <td>{{ prettyNum(labelMetrics.MEAN.cohen) }}</td>
                <td>{{ prettyNum(labelMetrics.MEAN.fleiss) }}</td>
                <td>{{ prettyNum(labelMetrics.MEAN.randolph) }}</td>
                <td>{{ prettyNum(labelMetrics.MEAN.krippendorff) }}</td>
                <td>{{ prettyNum(labelMetrics.MEAN.pearson) }} (p={{ prettyNum(labelMetrics.MEAN.pearson_p) }})</td>
                <td>{{ prettyNum(labelMetrics.MEAN.kendall) }} (p={{ prettyNum(labelMetrics.MEAN.kendall_p) }})</td>
                <td>{{ prettyNum(labelMetrics.MEAN.spearman) }} (p={{ prettyNum(labelMetrics.MEAN.spearman) }})</td>
                <td></td>
                <td></td>
              </tr>
              <template v-if="!onlyMean">
                <template v-for="userMetric in labelMetrics.USERS" :key="userMetric.annotation_quality_id as string">
                  <tr>
                    <td class="table-success small">
                      {{ userLookup[userMetric.user_base as string].username }}
                      &rarr;
                      {{ userLookup[userMetric.user_target as string].username }}
                      <span
                        class="text-muted ms-2 p-1"
                        :class="{ 'bg-success': userMetric.annotation_quality_id === focusedMetric }"
                        role="button"
                        @click="toggleAnnotations(userMetric.annotation_quality_id as string)"
                      >
                        <font-awesome-icon :icon="['fas', 'tags']" />
                      </span>
                    </td>
                    <td>{{ prettyNum(userMetric.cohen) }}</td>
                    <td>{{ prettyNum(userMetric.fleiss) }}</td>
                    <td>{{ prettyNum(userMetric.randolph) }}</td>
                    <td>{{ prettyNum(userMetric.krippendorff) }}</td>
                    <td>{{ prettyNum(userMetric.pearson) }} (p={{ prettyNum(userMetric.pearson_p) }})</td>
                    <td>{{ prettyNum(userMetric.kendall) }} (p={{ prettyNum(userMetric.kendall_p) }})</td>
                    <td>{{ prettyNum(userMetric.spearman) }} (p={{ prettyNum(userMetric.spearman) }})</td>
                    <td>{{ prettyNum(userMetric.num_overlap) }}/{{ prettyNum(userMetric.num_items) }}</td>
                    <td>
                      <font-awesome-icon :icon="['far', 'circle-check']" />
                      {{ prettyNum(userMetric.num_agree) }}
                      <font-awesome-icon :icon="['far', 'circle-xmark']" class="ms-2" />
                      {{ prettyNum(userMetric.num_disagree) }}
                    </td>
                  </tr>
                  <tr v-if="focusedMetric == userMetric.annotation_quality_id">
                    <td colspan="10" class="overflow-x-auto">
                      <div class="d-flex justify-content-start small">
                        <div v-for="(base, i) in userMetric.annotations_base" :key="i" class="d-flex flex-column">
                          <div class="p-1">
                            {{ prettyAnno(base) }}
                          </div>
                          <div
                            v-if="userMetric.annotations_target"
                            class="p-1"
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
          No metrics available (yet).
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
  UserBaseModel,
} from "@/plugins/api/api-core";
import { currentProjectStore } from "@/stores";
import { API, ignore, toastReject } from "@/plugins/api";
import type { AssignmentScopeModel } from "@/plugins/api/api-core";
import LabelPathPills from "@/components/annotations/LabelPathPills.vue";
import AssignmentsVisualiser from "@/components/annotations/assignments/AssignmentsVisualiser.vue";
import { isArray, isNone } from "@/util";

type MetricLabelLookup = {
  MEAN: AnnotationQualityModel | null;
  USERS: AnnotationQualityModel[];
};
type MetricLookup = Record<string, MetricLabelLookup>;

export default defineComponent({
  name: "ScopeQuality",
  components: { AssignmentsVisualiser, LabelPathPills },
  props: {
    scope: {
      type: Object as PropType<AssignmentScopeModel>,
      required: true,
    },
    users: {
      type: Object as PropType<Record<string, UserBaseModel>>,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      inFocus: false,
      assignmentsVisible: false,
      onlyMean: true,
      userLookup: this.users,
      focusedMetric: null as null | string,
      counts: null as AssignmentCounts | null,
      metrics: null as Array<AnnotationQualityModel> | null,
      assignments: null as Array<AssignmentScopeEntry> | null,
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

    if (!this.users || Object.entries(this.users).length === 0) {
      API.core.users
        .getProjectAnnotatorUsersApiUsersListProjectAnnotatorsProjectIdGet({
          projectId: currentProjectStore.projectId as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.userLookup = response.data;
        })
        .catch(ignore);
    }
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
      this.inFocus = !this.inFocus;
      if (this.metrics === null) {
        this.loadMetrics();
      }
    },
    loadMetrics() {
      API.core.evaluation
        .getIrrApiEvalQualityLoadAssignmentScopeIdGet({
          assignmentScopeId: this.scope.assignment_scope_id as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.metrics = response.data;
        })
        .catch(toastReject);
    },
    recomputeMetrics() {
      API.core.evaluation
        .recomputeIrrApiEvalQualityComputeGet({
          assignmentScopeId: this.scope.assignment_scope_id as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.metrics = response.data;
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
    nestedMetrics(): MetricLookup | undefined {
      if (this.metrics && this.metrics.length > 0) {
        const lookup: MetricLookup = {};
        this.metrics.forEach((metric: AnnotationQualityModel) => {
          const key = metric.label_path_key as string;
          if (!(key in lookup)) {
            lookup[key] = { MEAN: null, USERS: [] } as MetricLabelLookup;
          }
          if (!metric.user_base || !metric.user_target) {
            lookup[key].MEAN = metric;
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
