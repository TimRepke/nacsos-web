<template>
  <div class="m-2">
    <div class="row">
      <h5>Web of Science import</h5>
      <p class="text-muted">
        Import method for Web of Science text files. These can be obtained by querying web of science, clicking "export"
        and selecting "Plain text file". Please consult
        <a href="https://apsis.mcc-berlin.net/nacsos-docs/user/import/" target="_blank" rel="noopener noreferrer">
          the documentation
        </a>
        for additional details. For multi-file upload, press and hold <kbd>Shift</kbd> or <kbd>Ctrl</kbd> in file
        browser. Previously uploaded files will be overridden on next upload.
      </p>
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
        <template v-if="config && config.sources.length > 0">
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
import { ImportConfigEnum, type WoSImport } from "@/plugins/api/types";
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
const emptyConfig: WoSImport = {
  kind: ImportConfigEnum.WOS,
  sources: [] as string[],
};
export default defineComponent({
  name: "ConfigWoS",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<WoSImport>,
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
    if (!this.existingConfig || this.existingConfig.kind !== ImportConfigEnum.WOS) {
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
      const filenames = files.map((file) => file.serverPath).filter((filename) => !!filename);
      this.config.sources = filenames.length === 0 ? undefined : filenames;
    },
  },
  computed: {
    uploadsEnabled(): boolean {
      return this.editable && this.config;
    },
  },
  watch: {
    config: {
      handler(newValue: WoSImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: WoSImport) {
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
