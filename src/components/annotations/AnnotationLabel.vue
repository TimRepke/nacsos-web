<template>
  <div v-if="label.kind==='bool'">
    <div class="form-check form-switch">
      <label class="form-check-label" for="flexSwitchCheckDefault">{{ label.name }}</label>
      <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
             aria-checked="false">
    </div>
  </div>
  <div v-else-if="label.kind==='single'">
    {{ label.name }}
    <div>
      <button v-for="(choice, index) in label.choices" :key="index"
              type="button" class="btn btn-outline-secondary m-2"
              @click="selectChoice(label.key, choice.value)">{{ choice.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { AnnotationTaskLabel } from '@/types/annotation.d';
import { PropType } from 'vue';

export default {
  name: 'AnnotationLabel',
  props: {
    label: {
      type: Object as PropType<AnnotationTaskLabel>,
    },
  },
};
</script>

<style scoped>

</style>
