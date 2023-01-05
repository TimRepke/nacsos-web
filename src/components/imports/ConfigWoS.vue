<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>JSONL import</h4>
        <p class="text-muted">
          Import method for Web of Science text files. These can be obtained by querying web of science, clicking
          "export" and selecting "Plain text file"
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
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import FilesUploader from '@/components/FilesUploader.vue';
import type { UploadFile } from '@/components/FilesUploader.vue';
import type { ImportConfigWoS } from '@/plugins/api/api-core';
import useVuelidate from '@vuelidate/core';
import type { BaseValidation, ValidationRule } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const areFilesUploaded: ValidationRule = {
  $validator(value?: UploadFile[]) {
    return value !== undefined
      && value.length > 0
      && value.every((file) => file.status === 'SUCCESS' && file.serverPath !== undefined);
  },
  $message: 'Files not uploaded yet.',
};

export default defineComponent({
  name: 'ConfigWoS',
  components: { FilesUploader },
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<ImportConfigWoS>,
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
    const config: ImportConfigWoS = (this.existingConfig) ? this.existingConfig : {
      filenames: [] as string[],
    };
    if (!this.existingConfig) {
      this.$emit('configChanged', config);
    }
    return {
      uploadsEnabled: this.editable && config.filenames.length === 0,
      files: [] as UploadFile[],
      config,
    };
  },
  validations() {
    return {
      files: { required, areFilesUploaded, $autoDirty: true },
    };
  },
  watch: {
    config: {
      handler(newValue: ImportConfigWoS) {
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
});
</script>

<style scoped>

</style>
