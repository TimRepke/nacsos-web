<template>
  <!--  <ScopeQualityRow quality="" label="" />-->
  <!--  <ScopeQualityRow v-for="userQuality in userQualities" :key="userQuality.annotation_quality_id" quality="" label="" />-->

  <ScopeQualityRow :quality="quality" :col-class="[bgClass]" :first-col-class="[bgClass]">
    <template v-if="isChoice">
      <font-awesome-icon icon="angle-right" class="text-muted ms-1 me-1" />
      {{ quality.label_key }}
      <span v-if="isChoice" class="fw-bold">= {{ quality.label_value }}</span>
    </template>
    <template v-else>
      {{ quality.label_key }}
    </template>

    <span
      v-if="userQualities"
      @click="toggleUsers"
      class="ms-2 p-1 text-muted small"
      :class="{ 'bg-success': showUsers }"
    >
      <font-awesome-icon :icon="['fas', 'user-tag']" />
    </span>

    <span
      v-if="choiceQualities"
      @click="toggleChoices"
      class="ms-2 p-1 text-muted small"
      :class="{ 'bg-success': showChoices }"
    >
      <font-awesome-icon :icon="['fas', 'list-ol']" />
    </span>
  </ScopeQualityRow>

  <template v-if="showUsers">
    <ScopeQualityRow
      v-for="userMetric in userQualities"
      :key="userMetric.annotation_quality_id as string"
      :quality="userMetric"
      :first-col-class="[bgClass]"
      :col-class="[]"
    >
      {{ userMetric.user_base }}
      &rarr;
      {{ userMetric.user_target }}
    </ScopeQualityRow>
  </template>

  <template v-if="showChoices">
    <ScopeQualityEntry
      v-for="(choiceMetric, key) in choiceQualities"
      :key="key"
      :quality="choiceMetric.MEAN"
      :user-qualities="choiceMetric.USERS"
      bg-class="table-info"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { AnnotationQualityModel } from "@/plugins/api/api-core";
import { interfaceSettingsStore } from "@/stores";
import { isArray, isNone } from "@/util";
import ScopeQualityRow from "@/components/annotations/ScopeQualityRow.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  name: "ScopeQualityEntry",
  components: { FontAwesomeIcon, ScopeQualityRow },
  props: {
    quality: {
      type: Object as PropType<AnnotationQualityModel>,
      required: true,
    },
    userQualities: {
      type: Object as PropType<AnnotationQualityModel[]>,
      required: true,
    },
    choiceQualities: {
      type: Object as PropType<
        Record<number, { MEAN: AnnotationQualityModel | null; USERS: AnnotationQualityModel[] }>
      >,
      required: false,
      default: () => null,
    },
    bgClass: {
      type: String,
      required: false,
      default: () => "table-success",
    },
  },
  data() {
    return {
      numColumns: interfaceSettingsStore.numQualityColumns,
      visibleColumns: interfaceSettingsStore.qualityColumns,
      showUsers: false,
      showChoices: false,
    };
  },
  async mounted() {
    //pass
  },
  methods: {
    toggleChoices() {
      this.showChoices = !this.showChoices;
      this.showUsers = false;
    },
    toggleUsers() {
      this.showUsers = !this.showUsers;
      this.showChoices = false;
    },
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
  },
  computed: {
    isChoice(): boolean {
      return this.quality && !isNone(this.quality.label_value);
    },
  },
});
</script>

<style scoped></style>
