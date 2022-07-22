<template>
  <div class="text-start p-3 position-relative">
    <!--    <span class="text-warning">-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--      Please note that editing the scheme may break the database if assignments and/or annotations were already made.-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--    </span>-->

    <!-- Annotation Task Name -->
    <template v-if="nameEditMode">
      <div class="input-group mb-3 w-lg-50">
        <input type="text" class="form-control" placeholder="Annotation Task Name" aria-label="Annotation Task Name"
               aria-describedby="button-addon2" v-model="task.name">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="nameEditMode=false">
          <font-awesome-icon :icon="['fas', 'circle-check']"/>
        </button>
      </div>
    </template>
    <template v-else>
      <h1>
        {{ task.name }}
        <sup style="top:-0.8em; left: 0.2em" role="button" tabindex="0" @click="nameEditMode=true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']"/>
        </sup>
      </h1>
    </template>

    <!-- Annotation Task Description -->
    <template v-if="descriptionEditMode">
      <div class="hstack  align-items-start">
        <div class="form-floating w-lg-50">
        <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 100px" v-model="task.description"></textarea>
          <label for="floatingTextarea2">Comments</label>
        </div>
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="descriptionEditMode=false">
          <font-awesome-icon :icon="['fas', 'circle-check']"/>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="hstack mb-2 align-items-start">
        <div class="w-lg-50" v-html="htmlDescription"></div>
        <span role="button" tabindex="0" @click="descriptionEditMode=true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']"/>
        </span>
      </div>
    </template>

    <!-- Annotation Task Labels (root level) -->
    <AnnotationTaskLabelsEditor :labels="task.labels"/>
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save</button>
  </div>
</template>

<script lang="ts">
import {
  callSaveAnnotationTaskEndpoint,
  callTaskDefinitionEndpoint,
} from '@/plugins/api/annotations';
import { marked } from 'marked';
import { AnnotationTask } from '@/types/annotation.d';
import AnnotationTaskLabelsEditor from '@/components/annotations/AnnotationTaskLabelsEditor.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { currentProjectStore } from '@/stores';
import { ref } from 'vue';

export default {
  name: 'AnnotationConfigEditView',
  components: { AnnotationTaskLabelsEditor },
  data() {
    const { projectId } = currentProjectStore;
    const taskId = this.$route.params.task_id;

    return {
      taskId,
      isNewTask: !taskId,
      nameEditMode: false,
      descriptionEditMode: false,
      task: ref({
        project_id: projectId,
        name: 'New annotation task',
        description: 'Description for new task.',
        labels: [],
      } as AnnotationTask),
    };
  },
  async mounted() {
    if (!this.isNewTask) {
      const result = await callTaskDefinitionEndpoint({ taskId: this.taskId });
      if (result.status === 'SUCCESS' && result.payload) {
        this.task = ref(result.payload);
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment scope info. Please try reloading.'));
        throw Error('Something went wrong. Please tell the admin how you got here.');
      }
    }
  },
  methods: {
    save() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Editing the annotation task after assignment scopes, assignments, or annotations already exist for it '
        + 'can lead to very unexpected behaviour. Are you sure you want to proceed?',
        (response) => {
          if (response === 'ACCEPT') {
            callSaveAnnotationTaskEndpoint(this.task)
              .then((res) => {
                EventBus.emit(new ToastEvent(
                  'SUCCESS',
                  `Saved annotation task.  \n**ID:** ${res.payload}`,
                ));
                if (this.isNewTask) {
                  this.isNewTask = false;
                  this.$router.replace({ name: 'config-annotation-task-edit', params: { task_id: res.payload } });
                }
              })
              .catch((res) => {
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  `Failed to save the annotation task. (${res.reason})`,
                ));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not save the annotation task.'));
          }
        },
        'Save annotation task',
        'Yes, save!',
        'Nope!',
      ));
    },
  },
  computed: {
    htmlDescription() {
      return marked(this.task.description);
    },
  },
};
</script>

<style scoped>
</style>
