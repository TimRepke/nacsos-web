<template>
  <li class="border m-2 p-2">
    <div class="row mb-2 w-50">
      <div class="col-6">
        <span class="input-group">
          <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'eye']"/></span>
          <input type="text" class="form-control" placeholder="Visible name" aria-label="Visible name"
                 aria-describedby="basic-addon1" v-model="taskLabel.name">
        </span>
      </div>
      <div class="col-6">
        <span class="input-group">
          <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'key']"/></span>
          <input type="text" class="form-control" placeholder="Unique key" aria-label="Unique key"
                 aria-describedby="basic-addon1" v-model="taskLabel.key">
        </span>
      </div>
    </div>
    <div class="row mb-2 w-50">
      <div class="col-12">
        <span class="input-group">
          <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'circle-info']"/></span>
          <input type="text" class="form-control" placeholder="Hint message" aria-label="Hint message"
                 aria-describedby="basic-addon1" v-model="taskLabel.hint">
        </span>
      </div>
    </div>
    <div class="row mb-2 w-50">
      <div class="col-auto">
        <label for="autoSizingSelect">Type</label>
        <ToolTip>
          <strong>bool</strong> – boolean toggle<br>
          <strong>str</strong> – free string input<br>
          <strong>int</strong> – free integer input<br>
          <strong>float</strong> – free float input<br>
          <strong>single</strong> – pre-defined choices (only one can be selected)<br>
          <strong>multi</strong> – pre-defined choices (multiple can be selected)<br>
        </ToolTip>
        <select class="form-select" id="autoSizingSelect" v-model="taskLabel.kind">
          <option v-for="kind in annotationTaskLabelKinds" :key="kind" :value="kind">{{ kind }}</option>
        </select>
      </div>
      <div class="col-auto">
        <label for="autoSizingSelect">Max. Repeat</label>
        <input type="number" class="form-control" v-model="taskLabel.max_repeat"/>
      </div>
      <div class="col-auto">
        <div class="form-check form-switch">
          <input class="form-check-input" v-model="taskLabel.required" type="checkbox" role="switch"
                 id="flexSwitchCheckDefault" aria-checked="false">
          <label class="form-check-label" for="flexSwitchCheckDefault">Required</label>
        </div>
      </div>
    </div>
    <ul class="ps-2" v-if="label.choices !== null">
      <li v-for="(choice, i) in label.choices" :key="i">
        {{ choice.name }} | {{choice.value}} | {{choice.hint}}
        <ul class="ps-0" v-if="choice.children !== null">
          <AnnotationLabelEditor v-for="child in choice.children" :key="child.key" :label="child"/>
        </ul>
      </li>
    </ul>
  </li>
</template>

<script lang="ts">
import { AnnotationTaskLabel } from '@/types/annotation.d';
import { AnnotationTaskLabelKinds } from '@/plugins/api/annotations';
import { PropType } from 'vue';
import ToolTip from '@/components/ToolTip.vue';

console.log(AnnotationTaskLabelKinds);
export default {
  name: 'AnnotationLabelEditor',
  components: { ToolTip },
  props: {
    label: {
      type: Object as PropType<AnnotationTaskLabel>,
    },
  },
  data() {
    return {
      annotationTaskLabelKinds: AnnotationTaskLabelKinds,
      taskLabel: this.label,
    };
  },
};
</script>

<style scoped>
li {
  list-style: none;
}
</style>
