<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>JSONL import</h4>
        <p class="text-muted">
          Import method for JSONL encoded files (each line contains one JSON encoded object).
          The JSON object has to exactly reflect the database format unless there is a dedicated
          format translator available.<br />
          See documentation on which line type to choose.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <template v-if="uploadsEnabled">
          <FilesUploader
            :class="{
              'is-valid': !v$.files.$error,
              'is-invalid': v$.files.$error,
            }"
            @filesUpdated="onFilesChange($event)" />
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
import { ImportConfigJSONL, ProjectType } from '@/plugins/api/api-core';
import { currentProjectStore } from '@/stores';
import useVuelidate, { BaseValidation, ValidationRule } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import types = ImportConfigJSONL.line_type;

type CompatibilityMapping = { [key in ProjectType]: types[] };
const jsonlTypeCompatibility: CompatibilityMapping = {
  basic: [types.DB_BASIC_ITEM],
  academic: [types.DB_ACADEMIC_ITEM],
  patents: [types.DB_PATENT_ITEM],
  twitter: [types.DB_TWITTER_ITEM, types.TWITTER_API_PAGE],
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
  $validator(value?: ImportConfigJSONL.line_type) {
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
      required: true,
      default: null,
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
      line_type: undefined as ImportConfigJSONL.line_type | undefined,
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
