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
              <div class="progress">
                <div
                  role="progressbar"
                  :style="{ width: `${file.percentage}%` }"
                  class="progress-bar"
                  aria-label="File upload progress"
                  :aria-valuenow="file.percentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {{ file.percentage }}%
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint no-param-reassign: "off" */
import { defineComponent } from "vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import { EventBus } from "@/plugins/events";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";

type UploadStatus = "PENDING" | "UPLOADING" | "SUCCESS" | "FAILED";

export interface UploadFile {
  id: string;
  file: File;
  serverPath?: string;
  percentage: number;
  status: UploadStatus;
}

export default defineComponent({
  name: "FilesUploader",
  components: { InlineToolTip },
  emits: ["filesUpdated"],
  props: {
    uploadEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectedFiles: undefined as UploadFile[] | undefined,
      isUploading: false,
    };
  },
  methods: {
    selectFile(event: { target: { files: FileList } }) {
      this.selectedFiles = Array.from(event.target.files).map(
        (file: File) => ({ id: crypto.randomUUID(), file, percentage: 0, status: "PENDING" }) as UploadFile,
      );
    },
    upload(uploadFile: UploadFile, folder?: string) {
      this.isUploading = true;
      uploadFile.status = "UPLOADING";
      if (!folder) {
        folder = crypto.randomUUID();
      }

      return new Promise((resolve, reject) => {
        API.pipe.artefacts
          .uploadFileApiArtefactsFilesUploadPost(
            {
              xProjectId: currentProjectStore.projectId as string,
              folder,
              formData: { file: uploadFile.file },
            },
            {
              customRequestConfig: {
                onUploadProgress: (event: { loaded: number; total?: number }) => {
                  uploadFile.percentage = Math.round(100 * (event.loaded / (event.total || 1)));
                },
              },
            },
          )
          .then((response) => {
            uploadFile.status = "SUCCESS";
            uploadFile.serverPath = response.data;
            resolve(response.data);
          })
          .catch(() => {
            uploadFile.status = "FAILED";
            EventBus.emit(new ToastEvent("ERROR", `Failed to upload file "${uploadFile.file.name}"`));
            reject();
          });
      });
    },
    uploadFiles() {
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        const folder = crypto.randomUUID();
        const uploads = this.selectedFiles.map((file: UploadFile) => this.upload(file, folder));
        Promise.allSettled(uploads).then(() => {
          this.$emit("filesUpdated", this.selectedFiles);
        });
      }
    },
  },
});
</script>
