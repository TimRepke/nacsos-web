<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>OpenAlex file import</h5>
        <p class="text-muted">
          Upload a file, where each line has the exact same encoding used by our OpenAlex solr database. In other words,
          each line in this file is produced by
          <code>nacsos_data.models.openalex.solr.WorkSolr.dump_model_json()</code>. For multi-file upload, press and
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

<script lang="ts" setup>
import { computed, reactive, toRefs, watch } from "vue";
import type { PropType } from "vue";
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

defineOptions({ name: "ConfigJSONLOpenAlexWorks" });

const emit = defineEmits(["configChanged"]);

const props = defineProps({
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
});

const emptyConfig: OpenAlexFileImport = {
  kind: ImportConfigEnum.OA_FILE,
  sources: [] as string[],
};
const state = reactive({
  files: [] as UploadFile[],
  config: emptyConfig,
});
if (!props.existingConfig || props.existingConfig.kind !== ImportConfigEnum.OA_FILE) {
  emit("configChanged", emptyConfig);
} else {
  state.config = props.existingConfig;
}

const rules = {
  files: { required, areFilesUploaded, $autoDirty: true },
};
const v$ = useVuelidate(rules, state);

const { config } = toRefs(state);

function errorsToString(field: BaseValidation): string {
  return field.$errors.map((error) => error.$message).join("; ");
}
function onFilesChange(files: UploadFile[]) {
  state.files = files;
  const sources = files.map((file) => file.serverPath).filter((filename) => !!filename);
  config.value.sources = (sources.length === 0 ? undefined : sources) as string[];
}

const uploadsEnabled = computed((): boolean => {
  return (props.editable && config.value) as boolean;
});

watch(
  config,
  (newValue: OpenAlexFileImport) => {
    emit("configChanged", newValue);
  },
  { deep: true },
);
watch(
  () => props.existingConfig,
  (newValue) => {
    state.config = newValue as OpenAlexFileImport;
  },
  { deep: true },
);
watch(
  () => props.importId,
  (newValue) => {
    (config.value as { import_id?: string | null }).import_id = newValue;
  },
);
</script>

<style scoped></style>
