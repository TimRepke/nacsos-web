<template>
  <div>
    <h2>Annotation Progress Monitor</h2>
    <div v-if="trackers.length > 0">
      {{ trackers }}
    </div>
    <div v-else>Loading trackers for this project (or none found)...</div>
    <div class="mt-4">
      <button class="btn btn-outline-primary me-2" type="button">
        <font-awesome-icon :icon="['far', 'square-plus']" />
        Add tracker
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { DehydratedAnnotationTracker } from "@/plugins/api/api-core";
import { currentProjectStore } from "@/stores";
import { API, ignore } from "@/plugins/api";

export default defineComponent({
  name: "AnnotationTrackingView",
  data() {
    return {
      trackers: [] as DehydratedAnnotationTracker[],
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
  },
  methods: {
    // none
  },
});
</script>

<style scoped></style>
