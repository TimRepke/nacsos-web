<template>
  <tr v-if="quality">
    <td class="table-success small" :class="firstColClass">
      <slot />
      <span
        class="text-muted ms-2 p-1"
        :class="{ 'bg-success': showAnnotations }"
        role="button"
        v-if="hasLabels"
        @click="showAnnotations = !showAnnotations"
      >
        <font-awesome-icon :icon="['fas', 'tags']" />
      </span>
    </td>

    <td v-if="visibleColumns.cohen" :class="colClass">{{ prettyNum(quality.cohen) }}</td>
    <td v-if="visibleColumns.fleiss" :class="colClass">{{ prettyNum(quality.fleiss) }}</td>
    <td v-if="visibleColumns.randolph" :class="colClass">{{ prettyNum(quality.randolph) }}</td>
    <td v-if="visibleColumns.krippendorff" :class="colClass">{{ prettyNum(quality.krippendorff) }}</td>
    <td v-if="visibleColumns.pearson" :class="colClass">
      {{ prettyNum(quality.pearson) }}
      <span class="text-muted small" v-if="quality.pearson_p"> (p={{ prettyNum(quality.pearson_p) }}) </span>
    </td>
    <td v-if="visibleColumns.kendall" :class="colClass">
      {{ prettyNum(quality.kendall) }}
      <span class="text-muted small" v-if="quality.kendall_p"> (p={{ prettyNum(quality.kendall_p) }}) </span>
    </td>
    <td v-if="visibleColumns.spearman" :class="colClass">
      {{ prettyNum(quality.spearman) }}
      <span class="text-muted small" v-if="quality.spearman"> (p={{ prettyNum(quality.spearman) }}) </span>
    </td>
    <td v-if="visibleColumns.precision" :class="colClass">{{ prettyNum(quality.precision) }}</td>
    <td v-if="visibleColumns.recall" :class="colClass">{{ prettyNum(quality.recall) }}</td>
    <td v-if="visibleColumns.f1" :class="colClass">{{ prettyNum(quality.f1) }}</td>
    <td v-if="visibleColumns.multi_overlap_mean" :class="colClass">
      {{ prettyNum(quality.multi_overlap_mean) }}
      <span class="text-muted small" v-if="quality.multi_overlap_std">
        (&sigma;={{ prettyNum(quality.multi_overlap_std) }})
      </span>
    </td>
    <td v-if="visibleColumns.multi_overlap_median" :class="colClass">
      {{ prettyNum(quality.multi_overlap_median) }}
    </td>
    <td v-if="visibleColumns.num_agreement" :class="colClass">
      <font-awesome-icon :icon="['far', 'circle-check']" />
      {{ prettyNum(quality.num_agree) }}
      <font-awesome-icon :icon="['far', 'circle-xmark']" class="ms-2" />
      {{ prettyNum(quality.num_disagree) }}
      <span class="text-muted small" v-if="quality.perc_agree"> ({{ prettyNum(quality.perc_agree) }}%) </span>
    </td>
    <td v-if="visibleColumns.num_overlap" :class="colClass">
      {{ prettyNum(quality.num_overlap) }}/{{ prettyNum(quality.num_items) }}
    </td>
  </tr>
  <tr v-if="showAnnotations && hasLabels && quality">
    <td :colspan="numColumns + 1" class="overflow-x-auto">
      <div class="d-flex justify-content-start small">
        <div v-for="(base, i) in quality.annotations_base" :key="i" class="d-flex flex-column me-1">
          <div class="p-1 text-nowrap">
            {{ prettyAnno(base) }}
          </div>
          <div
            v-if="quality.annotations_target"
            class="p-1 text-nowrap"
            :class="annotationMatchBackground(base, quality.annotations_target[i])"
          >
            {{ prettyAnno(quality.annotations_target[i]) }}
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { AnnotationQualityModel } from "@/plugins/api/api-core";
import { interfaceSettingsStore } from "@/stores";
import { isArray, isNone } from "@/util";

export default defineComponent({
  name: "ScopeQualityRow",
  props: {
    quality: {
      type: Object as PropType<AnnotationQualityModel>,
      required: false,
      default: () => null,
    },
    firstColClass: {
      type: Object as PropType<string[]>,
      required: false,
      default: () => [] as string[],
    },
    colClass: {
      type: Object as PropType<string[]>,
      required: false,
      default: () => [] as string[],
    },
  },
  data() {
    return {
      numColumns: interfaceSettingsStore.numQualityColumns,
      visibleColumns: interfaceSettingsStore.qualityColumns,
      showAnnotations: false,
    };
  },
  async mounted() {
    //pass
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
      if (
        isArray(v1) &&
        v1 &&
        v2 &&
        JSON.stringify((v1 as number[]).sort()) === JSON.stringify((v2 as number[]).sort())
      )
        return "bg-success";
      if (v1 === v2) return "bg-success";
      if (isNone(v1) || isNone(v2)) return "bg-warning";
      return "bg-danger";
    },
  },
  computed: {
    hasLabels(): boolean {
      return !isNone(this.quality.annotations_base) && !isNone(this.quality.annotations_target);
    },
  },
});
</script>

<style scoped></style>
