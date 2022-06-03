<template>
  <div class="text-start p-3">
    <h1>{{ task.name }}</h1>
    <div>annotation_task_id: {{ task.annotation_task_id }}</div>
    <div>project_id: {{ task.project_id }}</div>
    <div>{{ task.description }}</div>
    <ul class="ps-0">
      <AnnotationLabelEditor v-for="taskLabel in task.labels" :key="taskLabel.key" :label="taskLabel"/>
    </ul>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { callTaskDefinitionEndpoint } from '@/plugins/api/annotations';
import AnnotationLabelEditor from '@/components/annotations/AnnotationLabelEditor.vue';

export default {
  name: 'AnnotationConfigEditView',
  components: { AnnotationLabelEditor },
  created() {
    // noop
  },
  async setup() {
    const route = useRoute();
    const currentAnnotationTaskId = route.params.task_id;
    const response = await callTaskDefinitionEndpoint({ taskId: currentAnnotationTaskId as string });
    return {
      task: response.payload,
    };
  },
};
</script>

<style scoped>
</style>
