<template>
  <div class="text-start p-3 position-relative">
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
        <div class="w-lg-50" v-html="markdownDescription()"></div>
        <span role="button" tabindex="0" @click="descriptionEditMode=true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']"/>
        </span>
      </div>
    </template>

    <!-- Annotation Task Labels (root level) -->
    <AnnotationTaskLabelsEditor :labels="task.labels" />
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save</button>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { callTaskDefinitionEndpoint } from '@/plugins/api/annotations';
import { marked } from 'marked';
import { AnnotationTask } from '@/types/annotation.d';
import AnnotationTaskLabelsEditor from '@/components/annotations/AnnotationTaskLabelsEditor.vue';

export default {
  name: 'AnnotationConfigEditView',
  components: { AnnotationTaskLabelsEditor },
  created() {
    // noop
  },
  data() {
    return {
      nameEditMode: false,
      descriptionEditMode: false,
    };
  },
  async setup() {
    const route = useRoute();
    const currentAnnotationTaskId = route.params.task_id;
    const response = await callTaskDefinitionEndpoint({ taskId: currentAnnotationTaskId as string });
    return {
      task: response.payload as AnnotationTask,
    };
  },
  methods: {
    markdownDescription() {
      return marked(this.task.description);
    },
    save() {
      // TODO implement
    },
  },
};
</script>

<style scoped>
</style>
