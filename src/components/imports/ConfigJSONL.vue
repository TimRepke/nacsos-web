<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>JSONL import</h4>
        <p class="text-muted">
          Import method for JSONl encoded files (each line contains one JSON encoded object).
          The JSON object has to exactly reflect the database format unless there is a dedicated
          format translator available.<br/>
          See documentation on which line type to choose.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <template v-if="uploadsEnabled">
          <FilesUploader></FilesUploader>
        </template>
        <template v-else>
          <h4>Uploaded files</h4>
          <ul>
            <li v-for="file in config.filenames" :key="file">
              {{ file }}
            </li>
          </ul>
        </template>
      </div>
      <div class="col">
        <label for="jsonl_line_type" class="form-label">Encoding used per line</label>
        <select id="jsonl_line_type" class="form-select" v-model="config.line_type">
          <option :value="undefined" disabled>Please select line encoding</option>
          <option v-for="tp in compatibleTypes" :key="tp" :value="tp">{{ tp }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FilesUploader from '@/components/FilesUploader.vue';
import { PropType } from 'vue';
import { ImportConfigJSONL, JSONLTypeLiteral } from '@/types/imports.d';
import { ProjectTypeLiteral } from '@/types/project.d';
import { currentProjectStore } from '@/stores';

type CompatibilityMapping = { [key in ProjectTypeLiteral]: JSONLTypeLiteral[] };
const jsonlTypeCompatibility: CompatibilityMapping = {
  basic: ['basic-item'],
  academic: ['academic-item'],
  patents: ['patent-item'],
  twitter: ['twitter-api-page', 'twitter-item'],
};
export default {
  name: 'ConfigJSONL',
  components: { FilesUploader },
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<ImportConfigJSONL>,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const config: ImportConfigJSONL = (this.existingConfig) ? this.existingConfig : {
      filenames: [] as string[],
      line_type: undefined as JSONLTypeLiteral | undefined,
    };
    if (!this.existingConfig) {
      this.$emit('configChanged', config);
    }
    return {
      compatibleTypes: jsonlTypeCompatibility[currentProjectStore.project.type],
      uploadsEnabled: this.editable && config.filenames.length === 0,
      config,
    };
  },
  watch: {
    config: {
      handler(newValue: ImportConfigJSONL) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
  },
  methods: {
    // pass
  },
};
</script>

<style scoped>

</style>
