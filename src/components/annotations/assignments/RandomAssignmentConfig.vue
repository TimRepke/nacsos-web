<template>
  <div>
    <strong>Configure random assignments</strong>
    <div class="row g-3 row-cols-auto">
      <div class="col">
        <label for="num_items">Number of items</label>
        <input
          type="number"
          id="num_items"
          class="form-control"
          aria-label="Number of items"
          placeholder="Number of items"
          v-model="config.num_items"
          :disabled="!editable" />
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
          :disabled="!editable" />
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
          :disabled="!editable" />
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
          :disabled="!editable" />
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
          :disabled="!editable" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { AssignmentScopeRandomConfig } from '@/plugins/api/api-core';

export default defineComponent({
  name: 'RandomAssignmentConfig',
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<AssignmentScopeRandomConfig>,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
    },
  },
  data() {
    const config: AssignmentScopeRandomConfig = (this.existingConfig) ? this.existingConfig : {
      config_type: 'random',
      num_items: 12,
      num_multi_coded_items: 8,
      min_assignments_per_item: 2,
      max_assignments_per_item: 3,
      random_seed: 10829,
    } as AssignmentScopeRandomConfig;
    if (!this.existingConfig) {
      this.$emit('configChanged', config);
    }
    return {
      config,
    };
  },
  watch: {
    config: {
      handler(newValue: AssignmentScopeRandomConfig) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
  },
});
</script>

<style scoped>

</style>
