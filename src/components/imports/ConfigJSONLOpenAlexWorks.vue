<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>OpenAlex file import</h5>
        <p class="text-muted">
          Upload a file, where each line has the exact same encoding used by our OpenAlex solr database. In other words,
          each line in this file is produced by
          <code>nacsos_data.models.openalex.solr.WorkSolr.dump_model_json()</code>.
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
            @filesUpdated="onFilesChange($event)"
          />
          <div class="invalid-feedback" v-if="v$.files.$error">
            {{ errorsToString(v$.files) }}
          </div>
        </template>
        <template v-else>
          <h5>Uploaded files</h5>
          <ul>
            <li v-for="file in config.sources" :key="file">
              {{ file }}
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import type { BaseValidation, ValidationRule } from "@vuelidate/core";
import { ImportConfigEnum, OpenAlexFileImport } from "@/plugins/api/types";
import FilesUploader from "@/components/FilesUploader.vue";
import type { UploadFile } from "@/components/FilesUploader.vue";

const areFilesUploaded: ValidationRule = {
  $validator(value?: UploadFile[]) {
    return (
      value !== undefined &&
      value.length > 0 &&
      value.every((file) => file.status === "SUCCESS" && file.serverPath !== undefined)
    );
  },
  $message: "Files not uploaded yet.",
};

export default defineComponent({
  name: "ConfigJSONLOpenAlexWorks",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<OpenAlexFileImport>,
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
    return {
      files: [] as UploadFile[],
      config: this.existingConfig
        ? this.existingConfig
        : ({
            kind: ImportConfigEnum.OA_FILE,
            sources: [] as string[],
          } as OpenAlexFileImport),
    };
  },
  methods: {
    errorsToString(field: BaseValidation): string {
      return field.$errors.map((error) => error.$message).join("; ");
    },
    onFilesChange(files: UploadFile[]) {
      this.files = files;
      const sources = files.map((file) => file.serverPath).filter((filename) => !!filename);
      this.config.sources = sources.length === 0 ? undefined : sources;
    },
  },
  computed: {
    uploadsEnabled(): boolean {
      return (
        this.editable &&
        this.config &&
        (this.config.sources === undefined || this.config.sources === null || this.config.sources.length === 0)
      );
    },
  },
  watch: {
    config: {
      handler(newValue: OpenAlexFileImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: OpenAlexFileImport) {
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

<style scoped></style>
