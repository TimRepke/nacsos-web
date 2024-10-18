<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>Scopus CSV import</h5>
        <p class="text-muted">
          Upload a Scopus CSV file, where you selected (almost) all fields to export. Please consult
          <a href="https://apsis.mcc-berlin.net/nacsos-docs/user/import/" target="_blank" rel="noopener noreferrer">
            the documentation
          </a>
          for additional details.
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
import { ImportConfigEnum, type ScopusImport } from "@/plugins/api/types";
import FilesUploader from "@/components/FilesUploader.vue";
import type { UploadFile } from "@/components/FilesUploader.vue";
import { isEmpty } from "@/util";

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
  name: "ConfigScopus",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<ScopusImport>,
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
            kind: ImportConfigEnum.SCOPUS,
            sources: [] as string[],
          } as ScopusImport),
    };
  },
  methods: {
    errorsToString(field: BaseValidation): string {
      return field.$errors.map((error) => error.$message).join("; ");
    },
    onFilesChange(files: UploadFile[]) {
      this.files = files;
      const sources = files.map((file) => file.serverPath).filter((source) => !!source);
      this.config.sources = sources.length === 0 ? undefined : sources;
    },
  },
  computed: {
    uploadsEnabled(): boolean {
      return this.editable && this.config && isEmpty(this.config.sources);
    },
  },
  watch: {
    config: {
      handler(newValue: ScopusImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: ScopusImport) {
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
