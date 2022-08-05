<template>
  <div class="text-start p-2">
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
                  <div class="me-2" style="height: 1rem; width:1rem;">
                    <font-awesome-icon role="button" class="text-muted" @click="toggleEntry(entry)"
                                       :icon="['fas',(entry.open) ? 'chevron-down' : 'chevron-right']"/>
                  </div>
                  <div>
                    {{ entry.info.name }}<br>
                    <span class="text-muted small"> {{ entry.info.module }}.<strong>{{
                        entry.info.function
                      }}(&sdot;)</strong></span>
                  </div>
                </div>
              </td>
              <td :class="noBorderIfOpen(entry)">
                {{ entry.task.status }}
              </td>
              <td :class="noBorderIfOpen(entry)">
                <span class="text-muted small"><strong>Submitted:</strong> {{ entry.task.dt_submitted }}</span><br>
                <span class="text-muted small"><strong>Started:</strong> {{ entry.task.dt_started }}</span><br>
                <span class="text-muted small"><strong>Finished:</strong>
                  {{ entry.task.dt_finished || entry.task.dt_cancelled }}</span>
              </td>
              <td :class="noBorderIfOpen(entry)">
                <font-awesome-icon role="button" class="text-muted me-1" :icon="['fas','circle-info']"/>
                <font-awesome-icon role="button" class="text-muted me-1" :icon="['fas','file-lines']"/>
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
                      <tr v-for="artefact in entry.artefacts" :key="artefact[0]">
                        <td>{{ artefact[0] }}</td>
                        <td>{{ artefact[1] }}</td>
                        <td></td>
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
import { FunctionInfo, TaskInDB, ArtefactFile } from '@/types/pipelines.d';
import {
  callPipelineLibraryFunctionsEndpoint,
  callPipelineTaskArtefactsEndpoint,
  callPipelineTaskSearchEndpoint,
  SearchRequestPayload,
} from '@/plugins/api/pipelines';
import { marked } from 'marked';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';

interface Entry {
  task: TaskInDB;
  info: FunctionInfo;
  showArtefacts: boolean;
  showLog: boolean;
  log: boolean;
  artefacts?: ArtefactFile[];
}

export default {
  name: 'ArtefactsListView',
  data() {
    return {
      entries: [] as Entry[],
      searchByUser: false as boolean,
      searchByProject: true as boolean,
      searchByFunctions: undefined as string | undefined,
      searchByTags: undefined as string | undefined,
    };
  },
  async mounted() {
    await this.loadEntries();
  },
  methods: {
    async loadEntries() {
      const tasks = (await callPipelineTaskSearchEndpoint(this.searchObject)).payload;
      if (!tasks) {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load tasks. Please try reloading the page.'));
        return;
      }

      const funcNames: string[] = Array.from(new Set(tasks.map((task: TaskInDB) => task.function_name)));
      const funcInfos = (await callPipelineLibraryFunctionsEndpoint({ func_name: funcNames })).payload;
      if (!funcInfos) {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load function infos. Please try reloading the page.'));
        return;
      }

      const funcs = Object.fromEntries(funcInfos.map((func: FunctionInfo) => [`${func.module}.${func.function}`, func]));

      this.entries = tasks.map((task: TaskInDB) => ({
        task,
        info: funcs[task.function_name],
        showArtefacts: false,
        showLog: false,
        log: false,
      }));
    },
    md2html(s: string): string {
      return marked(s);
    },
    async toggleEntry(entry: Entry) {
      const artefacts = (await callPipelineTaskArtefactsEndpoint({ taskId: entry.task.task_id })).payload;
      if (!artefacts) {
        EventBus.emit(new ToastEvent('WARN', `Failed to load additional info for task ${entry.task.task_id}`));
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
      return (this.isOpen(entry)) ? ['border-bottom-0'] : [];
    },
  },
  computed: {
    searchObject(): SearchRequestPayload {
      const searchObj: SearchRequestPayload = {};
      if (this.searchByProject) {
        searchObj.project_id = useCurrentProjectStore().projectId;
      }
      if (this.searchByUser) {
        searchObj.user_id = useCurrentUserStore().user?.user_id;
      }
      // TODO add the other search params
      return searchObj;
    },
  },
};
</script>

<style scoped>

</style>
