<template>
  <!-- FIXME Fix duplicate element ids (keep in mind this is all looped) -->
  <div>
    <ul class="ps-0 list-unstyled">
      <li
        v-for="(schemeLabel, schemeLabelIndex) in schemeLabels"
        :key="tmpKeyFor(schemeLabel)"
        class="border m-2 p-2 position-relative"
      >
        <div
          role="button"
          class="position-absolute top-0 end-0 m-2"
          tabindex="0"
          @click="removeLabel(schemeLabelIndex)"
        >
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </div>
        <div>
          <div class="d-flex flex-row gap-2 mb-2">
            <div class="gap-1 flex-shrink-1">
              <span role="button" class="align-middle" tabindex="0" @click="moveLabelDown(schemeLabelIndex)">
                <font-awesome-icon :icon="['fas', 'down-long']" />
              </span>
              <span role="button" tabindex="0" @click="moveLabelUp(schemeLabelIndex)">
                <font-awesome-icon :icon="['fas', 'up-long']" />
              </span>
            </div>
            <div class="ms-2">
              <span role="button" tabindex="0" @click="removeLabel(schemeLabelIndex)">
                <font-awesome-icon :icon="['fas', 'trash-can']" /> </span
              >&nbsp;
            </div>
            <div class="flex-fill">
              <span class="input-group">
                <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'eye']" /></span>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Visible name"
                  aria-describedby="basic-addon1"
                  placeholder="Visible name"
                  v-model="schemeLabel.name"
                />
              </span>
            </div>
            <div>
              <span class="input-group">
                <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'tag']" /></span>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Unique key"
                  aria-describedby="basic-addon1"
                  placeholder="Unique key"
                  v-model="schemeLabel.key"
                />
              </span>
            </div>
            <div class="flex-fill">
              <div class="input-group">
                <span id="basic-addon1" class="input-group-text"
                  ><font-awesome-icon :icon="['fas', 'circle-info']"
                /></span>
                <input
                  type="text"
                  class="form-control"
                  aria-label="Hint message"
                  aria-describedby="basic-addon1"
                  placeholder="Hint message"
                  v-model="schemeLabel.hint"
                />
              </div>
            </div>
          </div>
          <div class="row mb-2 w-lg-50">
            <div class="col-auto">
              <label for="autoSizingSelect">Type</label>
              <ToolTip>
                <strong>bool</strong> – boolean toggle<br />
                <strong>single</strong> – pre-defined choices (only one can be selected)<br />
                <strong>multi</strong> – pre-defined choices (multiple can be selected)<br />
                <strong>str</strong> – free-text string input<br />
                <strong>...</strong> – other types are not implemented, yet<br />
              </ToolTip>
              <select class="form-select" id="autoSizingSelect" v-model="schemeLabel.kind">
                <option v-for="kind in annotationSchemeLabelKinds" :key="kind" :value="kind">{{ kind }}</option>
              </select>
            </div>
            <div class="col-auto">
              <label :for="`max-repeat-${tmpKeyFor(schemeLabel)}`">Max. Repeat</label>
              <input
                type="number"
                class="form-control"
                :id="`max-repeat-${tmpKeyFor(schemeLabel)}`"
                v-model="schemeLabel.max_repeat"
              />
            </div>
            <div class="col-auto">
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  role="switch"
                  :id="`label-required-${tmpKeyFor(schemeLabel)}`"
                  class="form-check-input"
                  :aria-checked="schemeLabel.required"
                  v-model="schemeLabel.required"
                />
                <label class="form-check-label" :for="`label-required-${tmpKeyFor(schemeLabel)}`">Required</label>
              </div>
              <div class="form-check form-switch" v-if="schemeLabel.kind === 'single' || schemeLabel.kind === 'multi'">
                <input
                  type="checkbox"
                  role="switch"
                  :id="`label-dropdown-${tmpKeyFor(schemeLabel)}`"
                  class="form-check-input"
                  :aria-checked="schemeLabel.dropdown"
                  v-model="schemeLabel.dropdown"
                />
                <label class="form-check-label" :for="`label-required-${tmpKeyFor(schemeLabel)}`">Use dropdown</label>
              </div>
            </div>
          </div>

          <!-- BEGIN List label choices for pre-defined choices -->
          <div class="row ms-2" v-if="schemeLabel.kind === 'single' || schemeLabel.kind === 'multi'">
            <strong>Choices:</strong>
            <ul class="ps-2 ms-2 list-unstyled">
              <li v-for="(choice, choiceIndex) in schemeLabel.choices" :key="tmpKeyFor(choice)">
                <div class="row mb-2">
                  <div class="col-auto">
                    <span class="input-group">
                      <span class="input-group-text" id="basic-addon1"
                        ><font-awesome-icon :icon="['fas', 'eye']"
                      /></span>
                      <input
                        type="text"
                        class="form-control"
                        aria-label="Visible name"
                        aria-describedby="basic-addon1"
                        placeholder="Visible name"
                        v-model="choice.name"
                      />
                    </span>
                  </div>
                  <div class="col-3 col-lg-2">
                    <span class="input-group">
                      <span class="input-group-text" id="basic-addon1"
                        ><font-awesome-icon :icon="['fas', 'key']"
                      /></span>
                      <input
                        type="number"
                        class="form-control"
                        aria-label="Value"
                        aria-describedby="basic-addon1"
                        placeholder="Value"
                        v-model="choice.value"
                      />
                    </span>
                  </div>
                  <div class="col-5">
                    <span class="input-group">
                      <span class="input-group-text" id="basic-addon1">
                        <font-awesome-icon :icon="['fas', 'circle-info']" />
                      </span>
                      <input
                        type="text"
                        class="form-control"
                        aria-label="Hint message"
                        aria-describedby="basic-addon1"
                        placeholder="Hint message"
                        v-model="choice.hint"
                      />
                    </span>
                  </div>
                  <div class="col-auto align-middle">
                    <span
                      role="button"
                      class="align-middle"
                      tabindex="0"
                      @click="moveChoiceDown(schemeLabelIndex, choiceIndex)"
                    >
                      <font-awesome-icon :icon="['fas', 'down-long']" /> </span
                    >&nbsp;
                    <span role="button" tabindex="0" @click="moveChoiceUp(schemeLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'up-long']" /> </span
                    >&nbsp;
                    <span role="button" tabindex="0" @click="removeChoice(schemeLabelIndex, choiceIndex)">
                      <font-awesome-icon :icon="['fas', 'trash-can']" /> </span
                    >&nbsp;
                    <span
                      v-if="choice.children === null || choice.children.length === 0"
                      role="button"
                      class="nacsos-tooltip"
                      tabindex="0"
                      @click="addChild(schemeLabelIndex, choiceIndex)"
                    >
                      <font-awesome-icon :icon="['fas', 'diagram-predecessor']" />
                      <span class="nacsos-tooltiptext small"> Add sub-labels </span>
                    </span>
                  </div>
                </div>
                <div class="row ms-2" v-if="choice.children !== null && choice.children.length > 0">
                  <strong>Sub-annotations:</strong>
                  <AnnotationSchemeLabelsEditor :labels="choice.children" />
                </div>
              </li>
            </ul>
            <div>
              <button type="button" class="btn btn-outline-secondary" @click="addChoice(schemeLabelIndex)">
                Add choice
              </button>
            </div>
          </div>
          <!-- /END List label choices for pre-defined choices -->
        </div>
      </li>
    </ul>
    <div>
      <button type="button" class="btn btn-outline-primary mb-2" @click="addLabel()">Add Label</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { PropType } from "vue";
import ToolTip from "@/components/ToolTip.vue";
import {
  type AnnotationSchemeLabel,
  type AnnotationSchemeLabelChoice,
  AnnotationSchemeLabelKindEnum,
} from "@/plugins/api/types";

// TODO flatten list of all keys and make sure they are all unique (probably in AnnotationConfigEditView)
// TODO general input validation

defineOptions({ name: "AnnotationSchemeLabelsEditor" });

const props = defineProps({
  labels: {
    type: Object as PropType<AnnotationSchemeLabel[]>,
    required: true,
    default: null,
  },
});

const annotationSchemeLabelKinds = ref(AnnotationSchemeLabelKindEnum);
const schemeLabels = ref(props.labels);

// Stable v-for keys: each label/choice object gets its uuid exactly once (kept in a
// WeakMap keyed by object identity, so neither re-renders nor row moves remount the
// editor subtree and the keys never leak into the saved payload)
const tmpKeys = new WeakMap<object, string>();
function tmpKeyFor(obj: object): string {
  let tmpKey = tmpKeys.get(obj);
  if (!tmpKey) {
    tmpKey = crypto.randomUUID();
    tmpKeys.set(obj, tmpKey);
  }
  return tmpKey;
}

function addLabel() {
  schemeLabels.value.push({
    name: "",
    key: "newKey",
    hint: "",
    required: false,
    max_repeat: 1,
    kind: "bool",
    choices: [],
  } as AnnotationSchemeLabel);
}
function removeLabel(index: number) {
  schemeLabels.value.splice(index, 1);
}
function addChild(labelIndex: number, choiceIndex: number) {
  // TODO
  schemeLabels.value[labelIndex].choices![choiceIndex].children = [
    {
      name: "",
      key: "newKey",
      hint: "",
      required: false,
      max_repeat: 1,
      kind: "bool",
      choices: [],
    } as AnnotationSchemeLabel,
  ];
}
function addChoice(schemeLabelIndex: number) {
  schemeLabels.value[schemeLabelIndex].choices!.push({
    children: null,
    hint: null,
    name: "",
    value: schemeLabels.value[schemeLabelIndex].choices!.length,
  } as AnnotationSchemeLabelChoice);
}
function removeChoice(schemeLabelIndex: number, choiceIndex: number) {
  schemeLabels.value[schemeLabelIndex].choices!.splice(choiceIndex, 1);
}
function moveChoiceUp(schemeLabelIndex: number, currentChoiceIndex: number) {
  if (currentChoiceIndex > 0) {
    // This looks like sorcery, but it essentially just swaps two elements in an array.
    [
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex],
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex - 1],
    ] = [
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex - 1],
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex],
    ];
  }
}
function moveChoiceDown(schemeLabelIndex: number, currentChoiceIndex: number) {
  if (currentChoiceIndex < schemeLabels.value[schemeLabelIndex].choices!.length - 1) {
    // This looks like sorcery, but it essentially just swaps two elements in an array.
    [
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex],
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex + 1],
    ] = [
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex + 1],
      schemeLabels.value[schemeLabelIndex].choices![currentChoiceIndex],
    ];
  }
}
function moveLabelUp(currentSchemeLabelIndex: number) {
  if (currentSchemeLabelIndex > 0) {
    // This looks like sorcery, but it essentially just swaps two elements in an array.
    [schemeLabels.value[currentSchemeLabelIndex], schemeLabels.value[currentSchemeLabelIndex - 1]] = [
      schemeLabels.value[currentSchemeLabelIndex - 1],
      schemeLabels.value[currentSchemeLabelIndex],
    ];
  }
}
function moveLabelDown(currentSchemeLabelIndex: number) {
  if (currentSchemeLabelIndex < schemeLabels.value.length - 1) {
    // This looks like sorcery, but it essentially just swaps two elements in an array.
    [schemeLabels.value[currentSchemeLabelIndex], schemeLabels.value[currentSchemeLabelIndex + 1]] = [
      schemeLabels.value[currentSchemeLabelIndex + 1],
      schemeLabels.value[currentSchemeLabelIndex],
    ];
  }
}

// the parent may replace the whole labels array (e.g. after loading/saving the
// scheme); re-sync the local ref in that case
watch(
  () => props.labels,
  (labels: AnnotationSchemeLabel[]) => {
    schemeLabels.value = labels;
  },
);
</script>

<style scoped></style>
