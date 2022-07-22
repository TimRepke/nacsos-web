<template>
  <!-- FIXME Fix duplicate element ids (keep in mind this is all looped) -->
  <div>
    <ul class="ps-0 list-unstyled">
      <li class="border m-2 p-2 position-relative" v-for="(taskLabel, taskLabelIndex) in taskLabelsWithKey"
          :key="taskLabel.tmpKey">
        <div role="button" class="position-absolute top-0 end-0 m-2" @click="removeLabel(taskLabelIndex)" tabindex="0">
          <font-awesome-icon :icon="['fas', 'trash-can']"/>
        </div>
        <div>
          <div class="hstack gap-2 mb-2">
            <div class="hstack gap-1">
              <span role="button" class="align-middle" tabindex="0" @click="moveLabelDown(taskLabelIndex)">
                <font-awesome-icon :icon="['fas', 'down-long']"/>
              </span>
              <span role="button" tabindex="0" @click="moveLabelUp(taskLabelIndex)">
                <font-awesome-icon :icon="['fas', 'up-long']"/>
              </span>
            </div>
            <div>
        <span class="input-group">
          <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'eye']"/></span>
          <input type="text" class="form-control" placeholder="Visible name" aria-label="Visible name"
                 aria-describedby="basic-addon1" v-model="taskLabel.name">
        </span>
            </div>
            <div>
        <span class="input-group">
          <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'tag']"/></span>
          <input type="text" class="form-control" placeholder="Unique key" aria-label="Unique key"
                 aria-describedby="basic-addon1" v-model="taskLabel.key">
        </span>
            </div>
            <div>
              <div class="input-group">
                  <span class="input-group-text" id="basic-addon1"><font-awesome-icon
                    :icon="['fas', 'circle-info']"/></span>
                <input type="text" class="form-control" placeholder="Hint message" aria-label="Hint message"
                       aria-describedby="basic-addon1" v-model="taskLabel.hint">
              </div>
            </div>
          </div>
          <div class="row mb-2 w-lg-50">
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
          <!-- BEGIN List label choices for pre-defined choices -->
          <div class="row ms-2" v-if="taskLabel.kind === 'single' || taskLabel.kind === 'multi'">
            <strong>Choices:</strong>
            <ul class="ps-2 ms-2 list-unstyled">
              <li v-for="(choice, choiceIndex) in taskLabel.choices" :key="choice.tmpKey">
                <div class="row mb-2">
                  <div class="col-auto">
              <span class="input-group">
                <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'eye']"/></span>
                <input type="text" class="form-control" placeholder="Visible name" aria-label="Visible name"
                       aria-describedby="basic-addon1" v-model="choice.name">
              </span>
                  </div>
                  <div class="col-3 col-lg-2">
              <span class="input-group">
                <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'key']"/></span>
                <input type="number" class="form-control" placeholder="Value" aria-label="Value"
                       aria-describedby="basic-addon1" v-model="choice.value">
              </span>
                  </div>
                  <div class="col-auto">
              <span class="input-group">
                <span class="input-group-text" id="basic-addon1">
                  <font-awesome-icon :icon="['fas', 'circle-info']"/>
                </span>
                <input type="text" class="form-control" placeholder="Hint message" aria-label="Hint message"
                       aria-describedby="basic-addon1" v-model="choice.hint">
              </span>
                  </div>
                  <div class="col-auto align-middle">
                    <span role="button" class="align-middle" tabindex="0"
                          @click="moveChoiceDown(taskLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'down-long']"/>
                    </span>&nbsp;
                    <span role="button" tabindex="0" @click="moveChoiceUp(taskLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'up-long']"/>
                    </span>&nbsp;
                    <span role="button" tabindex="0" @click="removeChoice(taskLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'trash-can']"/>
                    </span>&nbsp;
                    <span role="button" class="nacsos-tooltip" tabindex="0"
                          v-if="choice.children === null || choice.children.length === 0"
                          @click="addChild(taskLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'diagram-predecessor']"/>
                      <span class="nacsos-tooltiptext small">
                        Add sub-labels
                      </span>
                    </span>
                  </div>
                </div>
                <div class="row ms-2" v-if="choice.children !== null && choice.children.length > 0">
                  <strong>Sub-annotations:</strong>
                  <AnnotationTaskLabelsEditor :labels="choice.children"/>
                </div>
              </li>
            </ul>
            <div>
              <button class="btn btn-outline-secondary" @click="addChoice(taskLabelIndex)">Add choice</button>
            </div>
          </div>
          <!-- /END List label choices for pre-defined choices -->
        </div>
      </li>
    </ul>
    <div>
      <button class="btn btn-outline-primary mb-2" @click="addLabel()">Add Label</button>
    </div>
  </div>
</template>

<script lang="ts">
import { AnnotationTaskLabel } from '@/types/annotation.d';
import { PropType } from 'vue';
import ToolTip from '@/components/ToolTip.vue';
import { AnnotationTaskLabelKinds } from '@/plugins/api/annotations';

// TODO flatten list of all keys and make sure they are all unique (probably in AnnotationConfigEditView)
// TODO general input validation

export default {
  name: 'AnnotationTaskLabelsEditor',
  components: { ToolTip },
  props: {
    labels: {
      type: Object as PropType<AnnotationTaskLabel[]>,
    },
  },
  data() {
    return {
      annotationTaskLabelKinds: AnnotationTaskLabelKinds,
      taskLabels: this.labels,
    };
  },
  methods: {
    addLabel() {
      this.taskLabels.push({
        tmpKey: crypto.randomUUID(),
        name: '',
        key: 'newKey',
        hint: '',
        required: false,
        max_repeat: 1,
        kind: 'bool',
        choices: [],
      } as AnnotationTaskLabel);
    },
    removeLabel(index: number) {
      this.taskLabels.splice(index, 1);
    },
    addChild(labelIndex: number, choiceIndex: number) {
      // TODO
      this.taskLabels[labelIndex].choices[choiceIndex].children = [{
        tmpKey: crypto.randomUUID(),
        name: '',
        key: 'newKey',
        hint: '',
        required: false,
        max_repeat: 1,
        kind: 'bool',
        choices: [],
      } as AnnotationTaskLabel];
    },
    addChoice(taskLabelIndex: number) {
      this.taskLabels[taskLabelIndex].choices.push({
        tmpKey: crypto.randomUUID(),
        children: null,
        hint: null,
        name: '',
        value: this.taskLabels[taskLabelIndex].choices.length,
      });
    },
    removeChoice(taskLabelIndex: number, choiceIndex: number) {
      this.taskLabels[taskLabelIndex].choices.splice(choiceIndex, 1);
    },
    moveChoiceUp(taskLabelIndex: number, currentChoiceIndex: number) {
      if (currentChoiceIndex > 0) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.taskLabels[taskLabelIndex].choices[currentChoiceIndex],
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex - 1]] = [
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex - 1],
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex]];
      }
    },
    moveChoiceDown(taskLabelIndex: number, currentChoiceIndex: number) {
      if (currentChoiceIndex < (this.taskLabels[taskLabelIndex].choices.length - 1)) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.taskLabels[taskLabelIndex].choices[currentChoiceIndex],
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex + 1]] = [
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex + 1],
          this.taskLabels[taskLabelIndex].choices[currentChoiceIndex]];
      }
    },
    moveLabelUp(currentTaskLabelIndex: number) {
      if (currentTaskLabelIndex > 0) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.taskLabels[currentTaskLabelIndex], this.taskLabels[currentTaskLabelIndex - 1]] = [
          this.taskLabels[currentTaskLabelIndex - 1], this.taskLabels[currentTaskLabelIndex]];
      }
    },
    moveLabelDown(currentTaskLabelIndex: number) {
      if (currentTaskLabelIndex < (this.taskLabels.length - 1)) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.taskLabels[currentTaskLabelIndex], this.taskLabels[currentTaskLabelIndex + 1]] = [
          this.taskLabels[currentTaskLabelIndex + 1], this.taskLabels[currentTaskLabelIndex]];
      }
    },
  },
  computed: {
    taskLabelsWithKey() {
      return this.taskLabels.map((taskLabel: AnnotationTaskLabel) => {
        // eslint-disable-next-line no-param-reassign
        taskLabel.tmpKey = crypto.randomUUID();
        return taskLabel;
      });
    },
  },
  watch: {
    labels: {
      // FIXME: somehow the props reference between taskLabels and props.labels broke
      //        this should be fixed, since this watch hack makes the config very slow!
      handler(labels: AnnotationTaskLabel[]) {
        this.taskLabels = labels;
      },
      // deep: true,
    },
  },
};
</script>

<style scoped>
</style>
