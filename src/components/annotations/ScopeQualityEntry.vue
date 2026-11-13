<template>
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
      role="button"
      tabindex="0"
      @click="toggleUsers"
      @keyup.enter="toggleUsers"
      @keyup.space="toggleUsers"
      class="ms-2 p-1 text-muted small"
      :class="{ 'bg-success': showUsers }"
    >
      <font-awesome-icon :icon="['fas', 'user-tag']" />
    </span>

    <span
      v-if="choiceQualities"
      role="button"
      tabindex="0"
      @click="toggleChoices"
      @keyup.enter="toggleChoices"
      @keyup.space="toggleChoices"
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

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { PropType } from "vue";
import type { AnnotationQualityModel } from "@/plugins/api/types";
import { isNone } from "@/util";
import ScopeQualityRow from "@/components/annotations/ScopeQualityRow.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineOptions({ name: "ScopeQualityEntry" });

const props = defineProps({
  quality: {
    type: Object as PropType<AnnotationQualityModel>,
    required: true,
  },
  userQualities: {
    type: Object as PropType<AnnotationQualityModel[]>,
    required: true,
  },
  choiceQualities: {
    type: Object as PropType<Record<number, { MEAN: AnnotationQualityModel | null; USERS: AnnotationQualityModel[] }>>,
    required: false,
    default: () => null,
  },
  bgClass: {
    type: String,
    required: false,
    default: () => "table-success",
  },
});

const showUsers = ref(false);
const showChoices = ref(false);

onMounted(async () => {
  //pass
});

const isChoice = computed<boolean>(() => props.quality && !isNone(props.quality.label_value));

function toggleChoices() {
  showChoices.value = !showChoices.value;
  showUsers.value = false;
}
function toggleUsers() {
  showUsers.value = !showUsers.value;
  showChoices.value = false;
}
</script>

<style scoped></style>
