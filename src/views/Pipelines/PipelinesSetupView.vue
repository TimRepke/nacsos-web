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
              <TaskConfigComponent :config="config" class="mb-2" ref="taskConfigs"
                                   @showInfo="highlight=$event" @pickArtefactReference="pickReference($event)"/>
            </template>
          </div>
        </div>
      </div>
      <!-- /Config Pane -->

    </div>

    <!-- FunctionInfo Card -->
    <div v-if="highlight !== undefined">
      <!-- FIXME @click="highlight=undefined"  -->
      <div class="modal fade show" tabindex="-1" style="display: block" data-bs-backdrop="static">
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
                        <code><strong>{{ arg }}:</strong><span v-if="tp.optional !== true">*</span> {{ $util.type2str(tp) }}</code>
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
                <pre class="card p-2 pb-0 flex-fill col-md-6">
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

    <!-- Artefact Reference Picker -->
    <div v-if="artefactQuery !== undefined">
      <div class="modal fade show" tabindex="-1" style="display: block" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Pick reference for artefact</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                      @click="resolveReferenceQuery(false)"></button>
            </div>
            <div class="modal-body text-start">
              <font-awesome-icon type="button" class="btn ms-auto small text-muted" :icon="['fas','rotate-right']"
                                 @click="loadQueuedTasks"/>
              <ul class="list-group">

                <!-- List of tasks currently configured -->
                <li class="list-group-item list-group-item-warning"
                    v-for="config in configs" :key="config.task.task_id">
                  <strong>{{ config.task.task_id }}</strong> {{ config.info.name }}
                  <code>{{ config.info.function }}(&sdot;)</code><br/>
                  <button type="button" class="btn btn-outline-secondary btn-sm"
                          v-for="(atype, art) in config.info.artefacts" :key="art"
                          @click="selectReference(config.task.task_id, art)">
                    <strong>{{ art }}:</strong> <code>Artefact[{{ atype.serializer }}, {{ atype.dtype }}]</code>
                  </button>
                </li>

                <!-- List of tasks in the DB -->
                <li class="list-group-item list-group-item-info"
                    v-for="task in queuedTasks" :key="task.task_id">
                  <strong>{{ task.task_id }}</strong>
                  <code>{{ task.function_name }}(&sdot;)</code><br/>
                  {{ task.comment }}
                  <button type="button" class="btn btn-outline-secondary btn-sm"
                          v-for="(atype, art) in getInfoByName(task.function_name).artefacts" :key="art"
                          @click="selectReference(task.task_id, art)">
                    <strong>{{ art }}:</strong> <code>Artefact[{{ atype.serializer }}, {{ atype.dtype }}]</code>
                  </button>
                </li>
              </ul>
              <h5 class="mt-2">Selected:</h5>
              <ul class="list-unstyled">
                <li><strong>Task:</strong> {{ artefactQueryReference.task_id || '[REF?]' }}</li>
                <li><strong>Artefact:</strong> {{ artefactQueryReference.artefact || '[REF?]' }}</li>
              </ul>
              <div class="d-flex justify-content-end">
                <button class="btn btn-outline-secondary m-2" @click="resolveReferenceQuery(false)">Cancel</button>
                <button class="btn btn-success m-2" @click="resolveReferenceQuery(true)">Select</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
    <!-- /Artefact Reference Picker -->
  </div>
</template>

<script lang="ts">
import {
  ArtefactCallback,
  ArtefactReference,
  FunctionInfo,
  NestedLibrary,
  SerializedArtefact,
  TaskConfig,
  TaskInDB,
} from '@/types/pipelines.d';
import {
  callPipelineLibraryEndpoint,
  callPipelineRefreshLibraryEndpoint,
  callPipelineTaskSearchEndpoint, callPipelineTasksSubmitEndpoint,
} from '@/plugins/api/pipelines';
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
      artefactQuery: undefined as SerializedArtefact | undefined,
      artefactQueryCallback: undefined as ArtefactCallback | undefined,
      artefactQueryReference: undefined as ArtefactReference | undefined,
      queuedTasks: [] as TaskInDB[],
      configs: [] as TaskConfig[],
    };
  },
  async mounted() {
    this.library = (await callPipelineLibraryEndpoint()).payload;
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
    async loadQueuedTasks() {
      // TODO: Add type matching -> Only show tasks where an output artefact matches the type of the param artefact type
      // FIXME: Add some filters? Ideally configurable in the interface (only this project, only current user).
      const response = (await callPipelineTaskSearchEndpoint()).payload;
      if (response) this.queuedTasks = response;
      else EventBus.emit(new ToastEvent('ERROR', 'Failed to load task queue.'));
    },
    pickReference(query: [SerializedArtefact, ArtefactReference]) {
      const [artefact, cb] = query;
      this.artefactQuery = artefact;
      this.artefactQueryCallback = cb;
      this.artefactQueryReference = {
        task_id: undefined,
        artefact: undefined,
      };
    },
    selectReference(taskId: string, artefact: string) {
      this.artefactQueryReference.task_id = taskId;
      this.artefactQueryReference.artefact = artefact;
    },
    resolveReferenceQuery(respond = true) {
      if (respond) {
        this.artefactQueryCallback(JSON.parse(JSON.stringify(this.artefactQueryReference)));
      }
      this.artefactQuery = undefined;
      this.artefactQueryReference = undefined;
      this.artefactQueryCallback = undefined;
    },
    getInfoByName(functionName: string) {
      return this.library.find((info: FunctionInfo) => `${info.module}.${info.function}` === functionName);
    },
    addTask(info: FunctionInfo) {
      this.configs.push({
        task: {
          task_id: crypto.randomUUID().replaceAll('-', ''),
          function_name: `${info.module}.${info.function}`,
          force_run: false,
          params: {},
          user_id: currentUserStore.user.user_id,
          project_id: currentProjectStore.projectId,
        },
        info,
      });
    },
    submitTasks() {
      // TODO check that all non-optional parameters are filled
      // TODO hide submit button otherwise (and if this.configs.length === 0)
      EventBus.emit(new ConfirmationRequestEvent(
        'This will submit all the tasks configured in this view to the compute pipeline. '
        + 'Please only proceed if you know exactly what you are doing!\n\n'
        + 'Cancellation of tasks is currently not implemented, so proceeding is extra-dangerous.',
        (response) => {
          if (response === 'ACCEPT') {
            // TODO implement

            const tasks = JSON.parse(JSON.stringify(Object.fromEntries(
              this.configs.map((config: TaskConfig) => [config.task.task_id, config.task]),
            )));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.$refs.taskConfigs.forEach((config: any) => {
              tasks[config.config.task.task_id].params = JSON.stringify(config.getTaskParams());
            });

            callPipelineTasksSubmitEndpoint(Object.values(tasks))
              .then((res) => {
                console.log(res.payload);
                EventBus.emit(new ToastEvent('SUCCESS', `Submitted ${res.payload?.length} tasks to the queue!`));
              })
              .catch((reason) => {
                EventBus.emit(new ToastEvent('ERROR', 'Failed to submit tasks!'));
                console.error(reason);
              });
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
    nestedLibrary() : NestedLibrary {
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
      if ('nacsos_lib' in ret) return ret.nacsos_lib as NestedLibrary;
      return ret;
    },
  },
};
</script>

<style scoped>

</style>
