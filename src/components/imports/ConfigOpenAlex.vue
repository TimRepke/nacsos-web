<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>OpenAlex import</h4>
        <p class="text-muted">
          Import directly from our self-hosted OpenAlex solr database.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <textarea
          v-model="config.query"
          :disabled="!editable"
          aria-label="Solr query"
          class="form-control"
          rows="5" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <label for="op" class="form-label">OP</label>
        <select class="form-select form-select form-select-sm" v-model="config.op" id="op">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>
      <div class="col">
        <label for="qfield" class="form-label">Field</label>
        <select class="form-select form-select form-select-sm" v-model="config.field" id="qfield">
          <option value="title">title</option>
          <option value="abstract">abstract</option>
          <option value="title_abstract">title_abstract</option>
        </select>
      </div>
      <div class="col">
        <label for="defType" class="form-label">Parser</label>
        <select class="form-select form-select form-select-sm" v-model="config.def_type" id="defType">
          <option value="lucene">lucene</option>
          <option value="dismax">dismax</option>
          <option value="edismax">edismax</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { OpenAlexImport } from '@/plugins/api/api-core';

export default defineComponent({
  name: 'ConfigOpenAlex',
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<OpenAlexImport>,
      required: false,
      default: null,
    },
    projectId: {
      type: String,
      required: false,
      default: null,
    },
    importId: {
      type: String,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const config: OpenAlexImport = (this.existingConfig) ? this.existingConfig : {
      func_name: 'nacsos_lib.academic.import.import_openalex',
      query: '',
      def_type: OpenAlexImport.def_type.LUCENE,
      field: OpenAlexImport.field.TITLE_ABSTRACT,
      op: OpenAlexImport.op.AND,
      project_id: this.projectId,
      import_id: this.importId,
    };
    if (!this.existingConfig) {
      this.$emit('configChanged', config);
    }
    if (!config.import_id && !!this.importId) {
      config.import_id = this.importId;
    }
    return {
      config,
    };
  },
  watch: {
    config: {
      handler(newValue: OpenAlexImport) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: OpenAlexImport) {
        this.config = newValue;
      },
      deep: true,
    },
    importId: {
      handler(newValue: string) {
        this.config.import_id = newValue;
      },
    },
  },
});
</script>

<style scoped>

</style>
