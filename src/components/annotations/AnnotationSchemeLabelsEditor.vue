<template>
  <!-- FIXME Fix duplicate element ids (keep in mind this is all looped) -->
  <div>
    <ul class="ps-0 list-unstyled">
      <li
        v-for="(schemeLabel, schemeLabelIndex) in schemeLabelsWithKey"
        :key="schemeLabel.tmpKey"
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
              <label for="autoSizingSelect">Max. Repeat</label>
              <input type="number" class="form-control" v-model="schemeLabel.max_repeat" />
            </div>
            <div class="col-auto">
              <div class="form-check form-switch">
                <input
                  type="checkbox"
                  role="switch"
                  :id="`label-required-${schemeLabel.tmpKey}`"
                  class="form-check-input"
                  :aria-checked="schemeLabel.required"
                  v-model="schemeLabel.required"
                />
                <label class="form-check-label" :for="`label-required-${schemeLabel.tmpKey}`">Required</label>
              </div>
              <div class="form-check form-switch" v-if="schemeLabel.kind === 'single' || schemeLabel.kind === 'multi'">
                <input
                  type="checkbox"
                  role="switch"
                  :id="`label-dropdown-${schemeLabel.tmpKey}`"
                  class="form-check-input"
                  :aria-checked="schemeLabel.dropdown"
                  v-model="schemeLabel.dropdown"
                />
                <label class="form-check-label" :for="`label-required-${schemeLabel.tmpKey}`">Use dropdown</label>
              </div>
            </div>
          </div>

          <!-- BEGIN List label choices for pre-defined choices -->
          <div class="row ms-2" v-if="schemeLabel.kind === 'single' || schemeLabel.kind === 'multi'">
            <strong>Choices:</strong>
            <ul class="ps-2 ms-2 list-unstyled">
              <li v-for="(choice, choiceIndex) in schemeLabel.choices" :key="choice.tmpKey">
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

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import ToolTip from "@/components/ToolTip.vue";
import { type AnnotationSchemeLabel, AnnotationSchemeLabelKindEnum } from "@/plugins/api/types";

type KeyedAnnotationSchemeLabel = AnnotationSchemeLabel & { tmpKey?: string };

// TODO flatten list of all keys and make sure they are all unique (probably in AnnotationConfigEditView)
// TODO general input validation

export default defineComponent({
  name: "AnnotationSchemeLabelsEditor",
  components: { ToolTip },
  props: {
    labels: {
      type: Object as PropType<AnnotationSchemeLabel[]>,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      annotationSchemeLabelKinds: AnnotationSchemeLabelKindEnum,
      schemeLabels: this.labels,
    };
  },
  methods: {
    addLabel() {
      this.schemeLabels.push({
        tmpKey: crypto.randomUUID(),
        name: "",
        key: "newKey",
        hint: "",
        required: false,
        max_repeat: 1,
        kind: "bool",
        choices: [],
      } as AnnotationSchemeLabel);
    },
    removeLabel(index: number) {
      this.schemeLabels.splice(index, 1);
    },
    addChild(labelIndex: number, choiceIndex: number) {
      // TODO
      this.schemeLabels[labelIndex].choices[choiceIndex].children = [
        {
          tmpKey: crypto.randomUUID(),
          name: "",
          key: "newKey",
          hint: "",
          required: false,
          max_repeat: 1,
          kind: "bool",
          choices: [],
        } as AnnotationSchemeLabel,
      ];
    },
    addChoice(schemeLabelIndex: number) {
      this.schemeLabels[schemeLabelIndex].choices.push({
        tmpKey: crypto.randomUUID(),
        children: null,
        hint: null,
        name: "",
        value: this.schemeLabels[schemeLabelIndex].choices.length,
      });
    },
    removeChoice(schemeLabelIndex: number, choiceIndex: number) {
      this.schemeLabels[schemeLabelIndex].choices.splice(choiceIndex, 1);
    },
    moveChoiceUp(schemeLabelIndex: number, currentChoiceIndex: number) {
      if (currentChoiceIndex > 0) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex],
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex - 1],
        ] = [
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex - 1],
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex],
        ];
      }
    },
    moveChoiceDown(schemeLabelIndex: number, currentChoiceIndex: number) {
      if (currentChoiceIndex < this.schemeLabels[schemeLabelIndex].choices.length - 1) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex],
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex + 1],
        ] = [
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex + 1],
          this.schemeLabels[schemeLabelIndex].choices[currentChoiceIndex],
        ];
      }
    },
    moveLabelUp(currentSchemeLabelIndex: number) {
      if (currentSchemeLabelIndex > 0) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.schemeLabels[currentSchemeLabelIndex], this.schemeLabels[currentSchemeLabelIndex - 1]] = [
          this.schemeLabels[currentSchemeLabelIndex - 1],
          this.schemeLabels[currentSchemeLabelIndex],
        ];
      }
    },
    moveLabelDown(currentSchemeLabelIndex: number) {
      if (currentSchemeLabelIndex < this.schemeLabels.length - 1) {
        // This looks like sorcery, but it essentially just swaps two elements in an array.
        [this.schemeLabels[currentSchemeLabelIndex], this.schemeLabels[currentSchemeLabelIndex + 1]] = [
          this.schemeLabels[currentSchemeLabelIndex + 1],
          this.schemeLabels[currentSchemeLabelIndex],
        ];
      }
    },
  },
  computed: {
    schemeLabelsWithKey() {
      return this.schemeLabels.map((schemeLabel: KeyedAnnotationSchemeLabel) => {
        // eslint-disable-next-line no-param-reassign
        schemeLabel.tmpKey = crypto.randomUUID();
        return schemeLabel;
      });
    },
  },
  watch: {
    labels: {
      // FIXME: somehow the props reference between schemeLabels and props.labels broke
      //        this should be fixed, since this watch hack makes the config very slow!
      handler(labels: AnnotationSchemeLabel[]) {
        this.schemeLabels = labels;
      },
      // deep: true,
    },
  },
});
</script>

<style scoped></style>
