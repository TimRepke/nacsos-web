<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>Twitter JSONL import</h4>
        <p class="text-muted">
          Import a file, where each line is a single Twitter v2 API response.
          Given that things changed a lot lately, the format we assume might be outdated.
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col" v-if="!!config">
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
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { BaseValidation, ValidationRule } from '@vuelidate/core';
import type { TwitterAPIFileImport } from '@/plugins/api/api-core';
import FilesUploader from '@/components/FilesUploader.vue';
import type { UploadFile } from '@/components/FilesUploader.vue';
import { currentProjectStore } from '@/stores';

const areFilesUploaded: ValidationRule = {
  $validator(value?: UploadFile[]) {
    return value !== undefined
      && value.length > 0
      && value.every((file) => file.status === 'SUCCESS' && file.serverPath !== undefined);
  },
  $message: 'Files not uploaded yet.',
};

export default defineComponent({
  name: 'ConfigJSONLTwitterAPI',
  components: { FilesUploader },
  emits: ['configChanged'],
  props: {
    existingConfig: {
      type: Object as PropType<TwitterAPIFileImport>,
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
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    const config: TwitterAPIFileImport = (this.existingConfig) ? this.existingConfig : this.emptyConfig();

    if (!config.import_id && !!this.importId) {
      config.import_id = this.importId;
    }

    return {
      files: [] as UploadFile[],
      config,
    };
  },
  methods: {
    emptyConfig(): Partial<TwitterAPIFileImport> | undefined {
      return {
        func_name: 'nacsos_lib.twitter.import.import_twitter_api',
        encoding: 'twitter-api-page',
        filenames: [],
        import_id: this.importId,
        project_id: currentProjectStore.projectId,
      };
    },
    errorsToString(field: BaseValidation): string {
      return field.$errors.map((error) => error.$message).join('; ');
    },
    onFilesChange(files: UploadFile[]) {
      this.files = files;
      const filenames = files.map((file) => file.serverPath).filter((filename) => !!filename);
      this.config.filenames = (filenames.length === 0) ? undefined : filenames;
    },
  },
  computed: {
    uploadsEnabled(): boolean {
      return this.editable
        && this.config
        && (
          this.config.filenames === undefined
          || this.config.filenames === null
          || this.config.filenames.length === 0
        );
    },
  },
  watch: {
    config: {
      handler(newValue: TwitterAPIFileImport) {
        this.$emit('configChanged', newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: TwitterAPIFileImport) {
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
  validations() {
    return {
      files: { required, areFilesUploaded, $autoDirty: true },
    };
  },
});
</script>

<style scoped>

</style>
