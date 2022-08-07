<template>
  <div class="text-start p-2 row">
    <div class="row">
      <h2>Pipeline setup</h2>
    </div>
    <div class="row g-2">

      <!-- Library Explorer -->
      <div class="col-4">
        <div class="card">
          <div class="card-header d-flex">
            Library
            <font-awesome-icon type="button" class="btn ms-auto small text-muted" :icon="['fas','rotate-right']"
                               @click="reloadLibrary"/>
          </div>
          <div class="card-body p-0 pt-2">
            <NestedExpandableComponent :tree="nestedLibrary" class="border-start-0"
                                       @showInfo="highlight=$event" @useFunc="addTask($event)"/>
          </div>
        </div>
      </div>
      <!-- /Library Explorer -->

      <!-- Config Pane -->
      <div class="col">
        <div class="card">
          <div class="card-body">
            <div class="d-flex mb-2">
              <button class="btn btn-success ms-auto" @click="submitTasks">Submit</button>
            </div>

            <template v-for="config in configs" :key="config.task.task_id">
              <TaskConfigComponent :config="config" class="mb-2"/>
            </template>
          </div>
        </div>
      </div>
      <!-- /Config Pane -->

    </div>

    <!-- FunctionInfo Card -->
    <div v-if="highlight !== undefined">
      <div class="modal fade show" tabindex="-1" style="display: block" data-bs-backdrop="static"
           @click="highlight=undefined">
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ highlight.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                      @click="highlight=undefined"></button>
            </div>
            <div class="modal-body text-start">
              <div class="d-flex flex-row flex-wrap" style="gap: 2rem">
                <ul class="list-unstyled small text-muted m-0">
                  <li>{{ highlight.module }}.<strong>{{ highlight.function }}(&sdot;)</strong></li>
                  <li><strong>Parameters:</strong>
                    <ul class="list-unstyled ms-2">
                      <li v-for="(tp, arg) in highlight.kwargs" :key="arg">
                        <code><strong>{{ arg }}:</strong> {{ tp2string(tp) }}</code>
                      </li>
                    </ul>
                  </li>
                  <li><strong>Location:</strong> {{ highlight.filepath_rel }}</li>
                  <li v-if="highlight.tags"><strong>Tags:</strong> {{ highlight.tags.join(', ') }}</li>
                  <li><strong>CPU load:</strong> {{ highlight.est_cpu_load }}</li>
                  <li v-if="highlight.recommended_lifetime"><strong>Artefact lifetime:</strong>
                    {{ highlight.recommended_lifetime }} days
                  </li>
                  <li v-if="!$util.isEmpty(highlight.artefacts)">
                    <strong>Produced artefacts:</strong>
                    <ul class="list-unstyled ms-2">
                      <li v-for="(artefact, aKey) in highlight.artefacts" :key="aKey">
                        <code>
                          <strong>{{ aKey }}:</strong>
                          Artefact[{{ artefact.serializer }}, {{ artefact.dtype }}]({{ artefact.filename }})
                        </code>
                      </li>
                    </ul>
                  </li>
                </ul>
                <pre class="card p-2 pb-0 flex-fill">
                  <code v-html="md2html(highlight.docstring)"></code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
    <!-- /FunctionInfo Card -->
  </div>
</template>

<script lang="ts">
import {
  ComplexKWARG,
  FunctionInfo,
  SerializedArtefact,
  NestedLibrary,
  TaskConfig,
} from '@/types/pipelines.d';
import { callPipelineLibraryEndpoint, callPipelineRefreshLibraryEndpoint } from '@/plugins/api/pipelines';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { marked } from 'marked';
import NestedExpandableComponent from '@/components/pipelines/NestedExpandableComponent.vue';
import TaskConfigComponent from '@/components/pipelines/TaskConfig.vue';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { currentProjectStore, currentUserStore } from '@/stores';

export default {
  name: 'PipelinesSetupView',
  components: { TaskConfigComponent, NestedExpandableComponent },
  data() {
    return {
      library: [] as FunctionInfo[],
      highlight: undefined as FunctionInfo | undefined,
      configs: [] as TaskConfig[],
    };
  },
  async mounted() {
    this.library = (await callPipelineLibraryEndpoint()).payload;
    // FIXME remove the following lines
    this.addTask(this.library[0]);
    this.addTask(this.library[1]);
  },
  methods: {
    async reloadLibrary() {
      const numFunctions = (await callPipelineRefreshLibraryEndpoint()).payload;
      callPipelineLibraryEndpoint().then((response) => {
        this.library = response.payload;
      });
      EventBus.emit(new ToastEvent('INFO', `Reload of library done, fetched ${numFunctions} functions.`));
    },
    md2html(s: string): string {
      return marked(s.trim());
    },
    tp2string(tp: string | SerializedArtefact | [string, object] | ComplexKWARG): string {
      if (typeof tp === 'string') {
        return tp;
      }
      if (Array.isArray(tp)) {
        const [key, val] = tp;
        return `${key} = ${val}`;
      }
      if ('dtype' in tp && 'params' in tp) {
        const { dtype, params } = tp;
        const parsedParams = Object.entries(params).map(([key_, dtype_]) => `${key_}: ${dtype_}`);
        return `${dtype}[${parsedParams.join(', ')}]`;
      }
      if ('serializer' in tp && 'dtype' in tp) {
        const { serializer, dtype } = tp;
        return `Artefact[${serializer}, ${dtype}]`;
      }
      return JSON.stringify(tp);
    },
    addTask(info: FunctionInfo) {
      this.configs.push({
        task: {
          task_id: crypto.randomUUID(),
          function_name: info.function,
          force_run: false,
          params: {},
          user_id: currentUserStore.user.user_id,
          project_id: currentProjectStore.projectId,
        },
        info,
      });
    },
    submitTasks() {
      EventBus.emit(new ConfirmationRequestEvent(
        'This will submit all the tasks configured in this view to the compute pipeline. '
        + 'Please only proceed if you know exactly what you are doing!\n\n'
        + 'Cancellation of tasks is currently not implemented, so proceeding is extra-dangerous.',
        (response) => {
          if (response === 'ACCEPT') {
            // TODO implement
            EventBus.emit(new ToastEvent('WARN', 'Lol, not implemented yet.'));
          }
        },
        'Submission of Task(s)',
        'Yes, proceed',
        'Cancel',
      ));
    },
  },
  computed: {
    filteredLibrary(): FunctionInfo[] {
      // TODO filter library by search queries
      //      -> by tag
      //      -> keywords in the docstring
      //      -> artefact types
      //      -> has matching artefact in queue (non-failed tasks)
      return this.library;
    },
    nestedLibrary() {
      const ret: NestedLibrary = {};

      function setInfo(path: string[], info: FunctionInfo) {
        let ptr = ret;
        path.forEach((key: string) => {
          if (!(key in ptr)) {
            ptr[key] = {};
          }
          ptr = ptr[key] as NestedLibrary;
        });
        ptr[info.function] = info;
      }

      this.filteredLibrary.forEach((info: FunctionInfo) => {
        const path = info.module.split('.');
        setInfo(path, info);
      });
      if ('nacsos_lib' in ret) return ret.nacsos_lib;
      return ret;
    },
  },
};
</script>

<style scoped>

</style>
