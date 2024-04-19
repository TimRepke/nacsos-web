<template>
  <div>
    <h2>Artefacts and task queue</h2>
    <div class="table-responsive card">
      <div class="card-body">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Task info</th>
              <th>Status</th>
              <th>Timings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="entry in entries" :key="entry.task.task_id">
              <tr>
                <td :class="noBorderIfOpen(entry)">
                  <div class="d-flex flex-row">
                    <div class="me-2" style="height: 1rem; width: 1rem">
                      <font-awesome-icon
                        role="button"
                        class="text-muted"
                        @click="toggleEntry(entry)"
                        :icon="['fas', entry.showArtefacts ? 'chevron-down' : 'chevron-right']"
                      />
                    </div>
                    <div>
                      {{ entry.info?.name || "DEPRECATED" }}<br />
                      <code class="small">{{ entry.task.function_name }}(&sdot;)</code><br />
                      <span class="text-muted small">{{ entry.task.comment }}</span>
                    </div>
                  </div>
                </td>
                <td :class="noBorderIfOpen(entry)">
                  {{ entry.task.status }}
                </td>
                <td :class="noBorderIfOpen(entry)">
                  <span class="text-muted small"><strong>Submitted:</strong> {{ entry.task.time_created }}</span
                  ><br />
                  <span class="text-muted small"><strong>Started:</strong> {{ entry.task.time_started }}</span
                  ><br />
                  <span class="text-muted small"><strong>Finished:</strong>{{ entry.task.time_finished }}</span>
                </td>
                <td :class="noBorderIfOpen(entry)">
                  <font-awesome-icon role="button" class="text-muted me-1" :icon="['fas', 'circle-info']" />
                  <font-awesome-icon role="button" class="text-muted me-1" :icon="['fas', 'file-lines']" />
                </td>
              </tr>
              <tr class="collapse show" v-if="entry.showArtefacts && entry.artefacts">
                <td colspan="4">
                  <div class="card">
                    <div class="card-body">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Filename</th>
                            <th>Filesize</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="artefact in entry.artefacts" :key="artefact.path">
                            <td>{{ artefact.path }}</td>
                            <td>{{ artefact.size }}</td>
                            <td>?</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { marked } from "marked";
import type { TaskModel, FileOnDisk } from "@/plugins/api/types";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { API } from "@/plugins/api";
import type { PipesService } from "@/plugins/api/spec/services.gen";
import { currentProjectStore, currentUserStore } from "@/stores";
import { ArgumentTypes } from "@/util";

interface Entry {
  task: TaskModel;
  showArtefacts: boolean;
  showLog: boolean;
  log: boolean;
  artefacts?: FileOnDisk[];
}

type ArtefactListData = {
  entries: Entry[];
  searchByUser: boolean;
  searchByProject: boolean;
  searchByFunctions?: string;
  searchByTags?: string;
};

type SearchParams = ArgumentTypes<typeof PipesService.searchTasksApiPipesTasksGet>[0];

export default defineComponent({
  name: "ArtefactsListView",
  data(): ArtefactListData {
    return {
      entries: [],
      searchByUser: false,
      searchByProject: true,
      searchByFunctions: undefined,
      searchByTags: undefined,
    };
  },
  async mounted() {
    await this.loadEntries();
  },
  methods: {
    async loadEntries() {
      try {
        const tasks = (await API.pipes.searchTasksApiPipesTasksGet(this.searchObject)).data;

        if (!tasks || tasks.length === 0) {
          EventBus.emit(
            new ToastEvent("WARN", "Failed to load tasks (or none found yet). Please try reloading the page later."),
          );
          return;
        }

        this.entries = tasks.map((task: TaskModel) => ({
          task,
          showArtefacts: false,
          showLog: false,
          log: false,
        }));
      } catch (e) {
        console.error(e);
        EventBus.emit(new ToastEvent("ERROR", "Loading data failed, please try reloading."));
      }
    },
    md2html(s: string): string {
      return marked.parse(s, { async: false }) as string;
    },
    async toggleEntry(entry: Entry) {
      const artefacts = (
        await API.pipes.getArtefactsApiPipesArtefactsListGet({
          xTaskId: entry.task.task_id as string,
          xProjectId: currentProjectStore.projectId as string,
        })
      ).data;
      if (!artefacts) {
        EventBus.emit(new ToastEvent("WARN", `Failed to load additional info for task ${entry.task.task_id}`));
      } else {
        // eslint-disable-next-line no-param-reassign
        entry.artefacts = artefacts;
        // eslint-disable-next-line no-param-reassign
        entry.showArtefacts = !entry.showArtefacts;
      }
    },
    isOpen(entry: Entry): boolean {
      return entry.showArtefacts || entry.showLog;
    },
    noBorderIfOpen(entry: Entry): string[] {
      return this.isOpen(entry) ? ["border-bottom-0"] : [];
    },
  },
  computed: {
    searchObject(): SearchParams {
      const searchObj: SearchParams = {
        xProjectId: currentProjectStore.projectId as string,
      };
      if (this.searchByUser) {
        const userId = currentUserStore.user?.user_id;
        searchObj.userId = userId === null || userId === undefined ? undefined : userId;
      }
      // TODO add the other search params
      return searchObj;
    },
  },
});
</script>

<style scoped></style>
