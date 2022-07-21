<template>
  <div class="text-start m-2">
    <h4>
      <font-awesome-icon :icon="['fa-brands', 'twitter']"/>
      Twitter Query Setup
    </h4>
    {{ config }}
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { ImportConfigTwitter } from '@/types/imports.d';

export default {
  name: 'ConfigTwitter',
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<ImportConfigTwitter>,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const config: ImportConfigTwitter = (this.existingConfig) ? this.existingConfig : {
      query: '',
      max_results: undefined,
      next_token: undefined,
      since_id: undefined,
      until_id: undefined,
      sort_order: undefined,
      start_time: undefined,
      end_time: undefined,
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
      handler(newValue: ImportConfigTwitter) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>

</style>
