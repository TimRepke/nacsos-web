<template>
  <div>
    <strong>Configure random assignments (with scope exclusion)</strong>
    <div class="row g-3 row-cols-auto mb-2">
      <div class="col">
        <label for="num_items">Number of items</label>
        <input
          type="number"
          id="num_items"
          class="form-control"
          aria-label="Number of items"
          placeholder="Number of items"
          v-model="config.num_items"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="num_multi_coded_items"># multi-coded items</label>
        <input
          type="number"
          id="num_multi_coded_items"
          class="form-control"
          aria-label="# multi-coded items"
          placeholder="# multi-coded items"
          v-model="config.num_multi_coded_items"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="min_assignments_per_item">Min. # coders per item</label>
        <input
          type="number"
          id="min_assignments_per_item"
          class="form-control"
          aria-label="Min. # coders per item"
          placeholder="Min. # coders per item"
          v-model="config.min_assignments_per_item"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="max_assignments_per_item">Max. # coders per item</label>
        <input
          type="number"
          id="max_assignments_per_item"
          class="form-control"
          aria-label="Max. # coders per item"
          placeholder="Max. # coders per item"
          v-model="config.max_assignments_per_item"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="random_seed">Random seed</label>
        <input
          type="number"
          id="random_seed"
          class="form-control"
          aria-label="Random seed"
          placeholder="Random seed"
          v-model="config.random_seed"
          :disabled="!editable"
        />
      </div>
    </div>
    <div class="row g-3">
      <p class="mb-1">
        You can exclude documents that were assigned in another scope. Check <strong>at least one</strong> of the
        assignment scopes from the following list.
      </p>
      <ul class="list-group mt-0 ps-4 pe-4">
        <li v-for="pScope in scopes" :key="pScope.assignment_scope_id" class="list-group-item">
          <input
            :id="`scope-${pScope.assignment_scope_id}`"
            :value="pScope.assignment_scope_id"
            v-model="config.excluded_scopes"
            :disabled="!editable"
            class="form-check-input me-1"
            type="checkbox"
          />
          <label :for="`scope-${pScope.assignment_scope_id}`" class="form-check-label stretched-link">
            {{ pScope.name }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { AssignmentScopeModel, AssignmentScopeRandomWithExclusionConfig } from "@/plugins/api/api-core";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";

export default defineComponent({
  name: "RandomAssignmentWithExclusionConfig",
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<AssignmentScopeRandomWithExclusionConfig>,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
    },
  },
  data() {
    const config: AssignmentScopeRandomWithExclusionConfig = this.existingConfig
      ? this.existingConfig
      : ({
          config_type: "random_exclusion",
          num_items: 12,
          num_multi_coded_items: 8,
          min_assignments_per_item: 2,
          max_assignments_per_item: 3,
          excluded_scopes: [],
          random_seed: 10829,
        } as AssignmentScopeRandomWithExclusionConfig);
    if (!this.existingConfig) {
      this.$emit("configChanged", config);
    }
    return {
      config,
      scopes: [] as AssignmentScopeModel[],
    };
  },
  mounted() {
    API.core.annotations
      .getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.scopes = response.data;
      })
      .catch(() => {
        // ignore
      });
  },
  watch: {
    config: {
      handler(newValue: AssignmentScopeRandomWithExclusionConfig) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
  },
});
</script>

<style scoped></style>
