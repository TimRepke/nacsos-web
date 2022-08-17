<template>
  <div>
    <div class="row mb-2">
      <div class="col">
        <label class="btn btn-default">
          <input type="file" multiple @change="selectFile"/>
        </label>

        <button class="btn btn-outline-primary"
                :disabled="isUploading || !uploadEnabled"
                @click="uploadFiles">
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
              <font-awesome-icon :icon="['fas', 'file-circle-exclamation']" v-if="file.status==='FAILED'"/>
              <font-awesome-icon :icon="['fas', 'file-circle-check']" v-else-if="file.status==='SUCCESS'"/>
              <font-awesome-icon :icon="['fas', 'file-arrow-up']" v-else-if="file.status==='UPLOADING'"/>
              <font-awesome-icon :icon="['far', 'paper-plane']" v-else/> <!--"file.status==='PENDING'"-->
            </InlineToolTip>
          </span>
              <div class="progress">
                <div class="progress-bar" role="progressbar" aria-label="File upload progress"
                     :style="{width: `${file.percentage}%` }"
                     :aria-valuenow="file.percentage" aria-valuemin="0" aria-valuemax="100">
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

<script lang='ts'>
/* eslint no-param-reassign: "off" */
import { ToastEvent } from '@/plugins/events/events/toast';
import { EventBus } from '@/plugins/events';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { callUploadUserArtefactEndpoint } from '@/plugins/api/pipelines';

type UploadStatus = 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'FAILED';

export interface UploadFile {
  id: string;
  file: File;
  serverPath?: string;
  percentage: number;
  status: UploadStatus;
}

export default {
  name: 'FilesUploader',
  components: { InlineToolTip },
  emits: ['filesUpdated'],
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
    selectFile(event: { target: { files: FileList; }; }) {
      this.selectedFiles = Array.from(event.target.files)
        .map((file: File) => ({ id: crypto.randomUUID(), file, percentage: 0, status: 'PENDING' } as UploadFile));
    },
    upload(uploadFile: UploadFile, folder?: string) {
      this.isUploading = true;
      uploadFile.status = 'UPLOADING';
      if (!folder) {
        folder = crypto.randomUUID();
      }

      return new Promise((resolve, reject) => {
        callUploadUserArtefactEndpoint({ file: uploadFile.file, folder }, {
          onUploadProgress: (event: { loaded: number; total: number; }) => {
            uploadFile.percentage = Math.round(100 * (event.loaded / event.total));
          },
        })
          .then((response) => {
            uploadFile.status = 'SUCCESS';
            uploadFile.serverPath = response.payload;
            resolve(response.payload);
          })
          .catch(() => {
            uploadFile.status = 'FAILED';
            EventBus.emit(new ToastEvent('ERROR', `Failed to upload file "${uploadFile.file.name}"`));
            reject();
          });
      });
    },
    uploadFiles() {
      if (this.selectedFiles && this.selectedFiles.length > 0) {
        const folder = crypto.randomUUID();
        this.selectedFiles.forEach((file: UploadFile) => {
          this.upload(file, folder);
        });
      }
    },
  },
  watch: {
    selectedFiles: {
      handler(newValue: UploadFile[]) {
        this.$emit('filesUpdated', newValue);
      },
      deep: true,
    },
  },
};
</script>
