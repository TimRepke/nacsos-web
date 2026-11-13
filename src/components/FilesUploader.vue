<template>
  <div>
    <div class="row mb-2">
      <div class="col">
        <label class="btn btn-default">
          <input type="file" multiple @change="selectFile" />
        </label>

        <button
          type="button"
          class="btn btn-outline-primary"
          :disabled="isUploading || !uploadEnabled"
          @click="uploadFiles"
        >
          Upload
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul v-if="selectedFiles">
          <li v-for="file in selectedFiles" :key="file.id">
            {{ file.file.name }}
            <span class="text-muted fst-italic">
              ({{ (file.file.size / 1024).toLocaleString(undefined, { maximumFractionDigits: 0 }) }} KB)
            </span>
            <div v-if="isUploading">
              <span class="text-muted">
                <InlineToolTip :info="file.status">
                  <font-awesome-icon v-if="file.status === 'FAILED'" :icon="['fas', 'file-circle-exclamation']" />
                  <font-awesome-icon v-else-if="file.status === 'SUCCESS'" :icon="['fas', 'file-circle-check']" />
                  <font-awesome-icon v-else-if="file.status === 'UPLOADING'" :icon="['fas', 'file-arrow-up']" />
                  <font-awesome-icon v-else :icon="['far', 'paper-plane']" />
                  <!--"file.status==='PENDING'"-->
                </InlineToolTip>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint no-param-reassign: "off" */
import { ref } from "vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import { EventBus } from "@/plugins/events";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";

defineOptions({ name: "FilesUploader" });

type UploadStatus = "PENDING" | "UPLOADING" | "SUCCESS" | "FAILED";

export interface UploadFile {
  id: string;
  file: File;
  serverPath?: string;
  percentage: number;
  status: UploadStatus;
}

const emit = defineEmits(["filesUpdated"]);

defineProps({
  uploadEnabled: {
    type: Boolean,
    default: true,
  },
});

const selectedFiles = ref<UploadFile[] | undefined>(undefined);
const isUploading = ref(false);

function selectFile(event: { target: { files: FileList } }) {
  selectedFiles.value = Array.from(event.target.files).map(
    (file: File) => ({ id: crypto.randomUUID(), file, percentage: 0, status: "PENDING" }) as UploadFile,
  );
}

function upload(uploadFile: UploadFile, folder?: string) {
  uploadFile.status = "UPLOADING";
  if (!folder) {
    folder = crypto.randomUUID();
  }

  return new Promise((resolve, reject) => {
    API.pipes
      .uploadFileApiPipesArtefactsFilesUploadPost({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        query: { folder },
        body: { file: uploadFile.file },
      })
      .then((response) => {
        uploadFile.status = "SUCCESS";
        uploadFile.percentage = 100;
        uploadFile.serverPath = response.data;
        resolve(response.data);
      })
      .catch(() => {
        uploadFile.status = "FAILED";
        EventBus.emit(new ToastEvent("ERROR", `Failed to upload file "${uploadFile.file.name}"`));
        reject();
      });
  });
}

// max number of files uploaded concurrently
const MAX_CONCURRENT_UPLOADS = 3;

function uploadFiles() {
  if (selectedFiles.value && selectedFiles.value.length > 0) {
    isUploading.value = true;
    const folder = crypto.randomUUID();
    const queue = [...selectedFiles.value];
    const worker = (): Promise<void> => {
      const file = queue.shift();
      if (!file) {
        return Promise.resolve();
      }
      return upload(file, folder)
        .catch(() => undefined)
        .then(worker);
    };
    const workers: Array<Promise<void>> = [];
    for (let i = 0; i < Math.min(MAX_CONCURRENT_UPLOADS, queue.length); i++) {
      workers.push(worker());
    }
    Promise.allSettled(workers).then(() => {
      emit("filesUpdated", selectedFiles.value);
      isUploading.value = false;
    });
  }
}
</script>
