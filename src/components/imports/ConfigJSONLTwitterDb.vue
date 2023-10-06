<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h4>TwitterItem file import</h4>
        <p class="text-muted">
          Upload a file, where each line has the exact same encoding used by our database. In other words, each line in
          this file is produced by
          <code>nacsos_data.models.items.twitter.TwitterItemModel.dump_model_json()</code>.
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
import type { TwitterDBFileImport } from "@/plugins/api/api-core";
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
  name: "ConfigJSONLTwitterDb",
  components: { FilesUploader },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<TwitterDBFileImport>,
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
    const config: TwitterDBFileImport = this.existingConfig ? this.existingConfig : this.emptyConfig();

    if (!config.import_id && !!this.importId) {
      config.import_id = this.importId;
    }

    return {
      files: [] as UploadFile[],
      config,
    };
  },
  methods: {
    emptyConfig(): Partial<TwitterDBFileImport> | undefined {
      return {
        func_name: "nacsos_lib.twitter.import.import_twitter_db",
        encoding: "db-twitter-item",
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
      handler(newValue: TwitterDBFileImport) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: TwitterDBFileImport) {
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
