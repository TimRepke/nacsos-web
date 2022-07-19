<template>
  <div>
    <strong>Configure random assignments</strong>
    <div class="row g-3 row-cols-auto">
      <div class="col">
        <label for="num_items">Number of items</label>
        <input type="number" id="num_items" class="form-control"
               v-model="config.num_items" :disabled="!editable"
               placeholder="Number of items" aria-label="Number of items">
      </div>
      <div class="col">
        <label for="num_multi_coded_items"># multi-coded items</label>
        <input type="number" id="num_multi_coded_items" class="form-control"
               v-model="config.num_multi_coded_items" :disabled="!editable"
               placeholder="# multi-coded items" aria-label="# multi-coded items">
      </div>
      <div class="col">
        <label for="min_assignments_per_item">Min. # coders per item</label>
        <input type="number" id="min_assignments_per_item" class="form-control"
               v-model="config.min_assignments_per_item" :disabled="!editable"
               placeholder="Min. # coders per item" aria-label="Min. # coders per item">
      </div>
      <div class="col">
        <label for="max_assignments_per_item">Max. # coders per item</label>
        <input type="number" id="max_assignments_per_item" class="form-control"
               v-model="config.max_assignments_per_item" :disabled="!editable"
               placeholder="Max. # coders per item" aria-label="Max. # coders per item">
      </div>
      <div class="col">
        <label for="random_seed">Random seed</label>
        <input type="number" id="random_seed" class="form-control"
               v-model="config.random_seed" :disabled="!editable"
               placeholder="Random seed" aria-label="Random seed">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RandomAssignmentConfig } from '@/types/annotation.d';
import { PropType } from 'vue';

export default {
  name: 'RandomAssignmentConfig',
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<RandomAssignmentConfig>,
    },
    editable: {
      type: Boolean,
    },
  },
  data() {
    const config: RandomAssignmentConfig = (this.existingConfig) ? this.existingConfig : {
      config_type: 'random',
      num_items: 12,
      num_multi_coded_items: 8,
      min_assignments_per_item: 2,
      max_assignments_per_item: 3,
      random_seed: 10829,
    };
    if (!this.existingConfig) {
      this.$emit('configChanged', config);
    }
    return {
      config,
    };
  },
  watch: {
    config: {
      handler(newValue: RandomAssignmentConfig) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>

</style>
