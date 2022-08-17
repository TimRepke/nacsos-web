<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>JSONL import</h4>
        <p class="text-muted">
          Import method for JSONL encoded files (each line contains one JSON encoded object).
          The JSON object has to exactly reflect the database format unless there is a dedicated
          format translator available.<br/>
          See documentation on which line type to choose.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <template v-if="uploadsEnabled">
          <FilesUploader @filesUpdated="onFilesChange($event)"
                         :class="{
                            'is-valid': !v$.files.$error,
                            'is-invalid': v$.files.$error,
                          }"/>
          <div class="invalid-feedback" v-if="v$.files.$error">
            {{ errorsToString(v$.files) }}
          </div>
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
        <div class="invalid-feedback" v-if="v$.config.line_type.$error">
          {{ errorsToString(v$.config.line_type) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FilesUploader, { UploadFile } from '@/components/FilesUploader.vue';
import { PropType } from 'vue';
import { ImportConfigJSONL, JSONLTypeLiteral } from '@/types/imports.d';
import { ProjectTypeLiteral } from '@/types/project.d';
import { currentProjectStore } from '@/stores';
import useVuelidate, { BaseValidation, ValidationRule } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

type CompatibilityMapping = { [key in ProjectTypeLiteral]: JSONLTypeLiteral[] };
const jsonlTypeCompatibility: CompatibilityMapping = {
  basic: ['db-basic-item'],
  academic: ['db-academic-item'],
  patents: ['db-patent-item'],
  twitter: ['db-twitter-item', 'twitter-api-page'],
};

const areFilesUploaded: ValidationRule = {
  $validator(value?: UploadFile[]) {
    return value !== undefined
      && value.length > 0
      && value.every((file) => file.status === 'SUCCESS' && file.serverPath !== undefined);
  },
  $message: 'Files not uploaded yet.',
};
const isValidLineType: ValidationRule = {
  $validator(value?: JSONLTypeLiteral) {
    return value !== undefined; // FIXME check for actual types (JSONLType.indexOf(value)>=0)
  },
  $message: 'Not a line encoding type.',
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
  setup() {
    return {
      v$: useVuelidate(),
    };
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
      files: [] as UploadFile[],
      config,
    };
  },
  validations() {
    return {
      files: { required, areFilesUploaded, $autoDirty: true },
      config: {
        line_type: { required, isValidLineType, $autoDirty: true },
      },
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
    errorsToString(field: BaseValidation) {
      return field.$errors.map((error) => error.$message).join('; ');
    },
    onFilesChange(files: UploadFile[]) {
      this.files = files;
      const filenames = files.map((file) => file.serverPath).filter((filename) => !!filename);
      this.config.filenames = (filenames.length === 0) ? undefined : filenames;
    },
  },
};
</script>

<style scoped>

</style>
