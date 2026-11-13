<template>
  <div class="m-2">
    <div class="row">
      <h5>Scopus CSV import</h5>
      <p class="text-muted">
        Upload a Scopus CSV file, where you selected (almost) all fields to export. Please consult
        <a href="https://nacsos.pik-potsdam.de/documentation/user/import/" target="_blank" rel="noopener noreferrer">
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

<script lang="ts" setup>
import type { PropType } from "vue";
import { computed, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import type { ValidationRule } from "@vuelidate/core";
import { ImportConfigEnum, type ScopusImport } from "@/plugins/api/types";
import FilesUploader from "@/components/FilesUploader.vue";
import type { UploadFile } from "@/components/FilesUploader.vue";
import { errorsToString } from "@/util/validators";

defineOptions({ name: "ConfigScopus" });

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

const emit = defineEmits(["configChanged"]);
const props = defineProps({
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
});

const emptyConfig: ScopusImport = {
  kind: ImportConfigEnum.SCOPUS,
  sources: [] as string[],
};

const files = ref<UploadFile[]>([]);
const config = ref<ScopusImport>(emptyConfig);
if (!props.existingConfig || props.existingConfig.kind !== ImportConfigEnum.SCOPUS) {
  emit("configChanged", emptyConfig);
} else {
  config.value = props.existingConfig;
}

const rules = {
  files: { required, areFilesUploaded, $autoDirty: true },
};
const v$ = useVuelidate(rules, { files });

const uploadsEnabled = computed<boolean>(() => (props.editable && config.value) as boolean);

function onFilesChange(newFiles: UploadFile[]) {
  files.value = newFiles;
  const sources = newFiles.map((file) => file.serverPath).filter((source) => !!source);
  config.value.sources = (sources.length === 0 ? undefined : sources) as string[];
}

watch(
  () => config.value,
  (newValue) => {
    emit("configChanged", newValue);
  },
  { deep: true },
);
watch(
  () => props.existingConfig,
  (newValue) => {
    config.value = newValue;
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
