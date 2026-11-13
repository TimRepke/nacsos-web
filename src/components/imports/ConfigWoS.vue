<template>
  <div class="m-2">
    <div class="row">
      <h5>Web of Science import</h5>
      <p class="text-muted">
        Import method for Web of Science text files. These can be obtained by querying web of science, clicking "export"
        and selecting "Plain text file". Please consult
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
import type { BaseValidation, ValidationRule } from "@vuelidate/core";
import { ImportConfigEnum, type WoSImport } from "@/plugins/api/types";
import FilesUploader from "@/components/FilesUploader.vue";
import type { UploadFile } from "@/components/FilesUploader.vue";

defineOptions({ name: "ConfigWoS" });

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

const emit = defineEmits(["configChanged"]);
const props = defineProps({
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
});

const files = ref<UploadFile[]>([]);
const config = ref<WoSImport>(emptyConfig);
if (!props.existingConfig || props.existingConfig.kind !== ImportConfigEnum.WOS) {
  emit("configChanged", emptyConfig);
} else {
  config.value = props.existingConfig;
}

const rules = {
  files: { required, areFilesUploaded, $autoDirty: true },
};
const v$ = useVuelidate(rules, { files });

function errorsToString(field: BaseValidation): string {
  return field.$errors.map((error) => error.$message).join("; ");
}

function onFilesChange(newFiles: UploadFile[]) {
  files.value = newFiles;
  const filenames = newFiles.map((file) => file.serverPath).filter((filename) => !!filename);
  config.value.sources = (filenames.length === 0 ? undefined : filenames) as string[];
}

const uploadsEnabled = computed<boolean>(() => (props.editable && config.value) as boolean);

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
