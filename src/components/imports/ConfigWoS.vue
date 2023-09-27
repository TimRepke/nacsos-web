<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>Web of Science import</h4>
        <p class="text-muted">
          Import method for Web of Science text files. These can be obtained by querying web of science, clicking
          "export" and selecting "Plain text file". Please consult
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
import type { PropType } from "vue";
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import type { BaseValidation, ValidationRule } from "@vuelidate/core";
import type { WOSImport } from "@/plugins/api/api-core";
import FilesUploader from "@/components/FilesUploader.vue";
import type { UploadFile } from "@/components/FilesUploader.vue";
import { currentProjectStore } from "@/stores";

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
  name: "ConfigWoS",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<WOSImport>,
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
    const config: WOSImport = this.existingConfig ? this.existingConfig : this.emptyConfig();

    if (!config.import_id && !!this.importId) {
      config.import_id = this.importId;
    }

    return {
      files: [] as UploadFile[],
      config,
    };
  },
  methods: {
    emptyConfig(): Partial<WOSImport> | undefined {
      return {
        func_name: "nacsos_lib.academic.import.import_wos_file",
        filenames: [],
        import_id: this.importId,
        project_id: currentProjectStore.projectId,
      };
    },
    errorsToString(field: BaseValidation): string {
      return field.$errors.map((error) => error.$message).join("; ");
    },
    onFilesChange(files: UploadFile[]) {
      this.files = files;
      const filenames = files.map((file) => file.serverPath).filter((filename) => !!filename);
      this.config.filenames = filenames.length === 0 ? undefined : filenames;
    },
  },
  computed: {
    uploadsEnabled(): boolean {
      return (
        this.editable &&
        this.config &&
        (this.config.filenames === undefined || this.config.filenames === null || this.config.filenames.length === 0)
      );
    },
  },
  watch: {
    config: {
      handler(newValue: WOSImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: WOSImport) {
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
