<template>
  <div>
    <h2>Pipeline Task</h2>
    <template v-if="task">
      <p class="lead">
        {{ task.comment }}
      </p>
      <div class="row">
        <div class="col-5 small">
          <ul class="list-unstyled">
            <li>
              <strong>{{ task.status }}</strong>
            </li>
            <li>
              <strong><code>task_id</code></strong
              >: <code>{{ task.task_id }}</code>
            </li>
            <li>
              <strong><code>user_id</code></strong
              >: <code>{{ task.user_id }}</code>
            </li>
            <li>
              <strong><code>fingerprint</code></strong
              >: <code>{{ task.fingerprint }}</code>
            </li>
            <li>
              <strong><code>location</code></strong
              >: <code>{{ task.location }}</code>
            </li>
            <li>
              <strong><code>function</code></strong
              >: <code>{{ task.function_name }}</code>
            </li>
            <li>
              <strong><code>started</code></strong
              >: <code>{{ task.time_started }}</code>
            </li>
            <li>
              <strong><code>finished</code></strong
              >: <code>{{ task.time_finished }}</code>
            </li>
            <li>
              marked for deletion: <code>{{ task.rec_expunge }}</code>
            </li>
            <li v-if="task.dependencies">
              Task dependencies:
              <ul>
                <li v-for="dependency in task.dependencies" :key="dependency">
                  <router-link :to="{ name: 'project-artefacts-details', params: { taskId: dependency } }">
                    {{ dependency }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <pre class="border rounded-2 ps-1"><code>{{ task.params }}</code></pre>
        </div>
        <div class="col">
          <h4>Artefacts</h4>
          <ul>
            <li>
              <span role="button" tabindex="0" @click="downloadArchive()" class="me-2">
                <font-awesome-icon :icon="['fas', 'file-zipper']" />
              </span>
              Download all as .zip
            </li>
            <li v-for="artefact in artefacts" :key="artefact.path">
              <span role="button" tabindex="0" @click="downloadFile(artefact.path)" class="me-2">
                <font-awesome-icon :icon="['fas', 'download']" />
              </span>
              <code>{{ artefact.path.substring(37) }}</code>
              ({{ artefact.size / 1000 }}kb)
            </li>
          </ul>
          <button type="button" @click="loadLog" class="btn btn-sm btn-secondary m-2">Load log</button>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <pre class="border rounded-2 ps-1 logwindow" v-if="log"><code>{{ log }}</code></pre>
        </div>
      </div>
    </template>
    <template v-else> Loading... </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { FileOnDisk, TaskModel } from "@/plugins/api/api-pipe";
import { API, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
// @ts-ignore
import saveAs from "@/util/filesaver";
// const FileSaver = require('@/util/filesaver');

export default defineComponent({
  name: "ArtefactsListView",
  data() {
    const { taskId } = this.$route.params;
    return {
      taskId,
      pid: currentProjectStore.projectId,
      task: undefined as TaskModel | undefined,
      artefacts: [] as FileOnDisk[],
      log: undefined as string | undefined,
    };
  },
  mounted() {
    API.pipe.queue
      .getTaskApiQueueTaskTaskIdGet({
        taskId: this.taskId as string,
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.task = response.data;
      })
      .catch(toastReject);

    API.pipe.artefacts
      .getArtefactsApiArtefactsListGet({
        xTaskId: this.taskId as string,
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.artefacts = response.data;
      })
      .catch(toastReject);
  },
  methods: {
    downloadArchive() {
      API.pipe.artefacts
        .getArchiveApiArtefactsFilesGet({
          xTaskId: this.taskId,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          const file = new File([response.data], "archive.zip", { type: "application/zip;charset=utf-8" });
          // FileSaver.saveAs(file);
          saveAs(file);
        })
        .catch(toastReject);
    },
    downloadFile(filename: string) {
      const parts = filename.split("/");
      API.pipe.artefacts
        .getFileApiArtefactsFileGet({
          filename,
          xTaskId: this.taskId,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          const file = new File([response.data], parts[parts.length - 1]);
          // FileSaver.saveAs(file);
          saveAs(file);
        })
        .catch(toastReject);
    },
    loadLog() {
      API.pipe.artefacts
        .getTaskLogApiArtefactsLogGet({
          xTaskId: this.taskId,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.log = response.data;
        })
        .catch(toastReject);
    },
  },
  computed: {
    // pass
  },
});
</script>

<style scoped>
.logwindow {
  max-height: 70em;
  overflow-y: auto;
}
</style>
