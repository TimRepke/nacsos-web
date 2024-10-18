<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>AcademicItem file import</h5>
        <p class="text-muted">
          Upload a file, where each line has the exact same encoding for academic items in our database. In other words,
          each line in this file is produced by
          <code>nacsos_data.models.items.AcademicItemModel.dump_model_json()</code>. For multi-file upload, press and
          hold <kbd>Shift</kbd> or <kbd>Ctrl</kbd> in file browser. Previously uploaded files will be overridden on next
          upload.
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
import { AcademicItemImport, ImportConfigEnum } from "@/plugins/api/types";
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
  name: "ConfigJSONLAcademicItem",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<AcademicItemImport>,
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
    const emptyConfig: AcademicItemImport = {
      kind: ImportConfigEnum.ACADEMIC,
      sources: [] as string[],
    };
    if (!this.existingConfig || this.existingConfig.kind !== ImportConfigEnum.ACADEMIC) {
      this.$emit("configChanged", emptyConfig);
      return { files: [] as UploadFile[], config: emptyConfig };
    }
    return { files: [] as UploadFile[], config: this.existingConfig };
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
      return this.editable && this.config;
    },
  },
  watch: {
    config: {
      handler(newValue: AcademicItemImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: AcademicItemImport) {
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
