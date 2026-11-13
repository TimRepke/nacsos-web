<template>
  <ul class="list-unstyled">
    <li
      v-for="(label, labelIndex) in labels"
      :key="`${label.key}-${label.annotation?.repeat}`"
      class="mb-3"
      :class="{ selected: labelIndex === selectedIdx && selectedChildIdx < 0 }"
    >
      <div
        class="mb-2"
        v-if="
          label.annotation !== undefined &&
          label.annotation !== null &&
          label.max_repeat !== null &&
          label.max_repeat !== undefined
        "
      >
        <div>
          <strong class="label-name">{{ label.name }}</strong>
          <span v-if="label.max_repeat > 1" style="font-size: 0.875rem">
            ({{ label.annotation.repeat }} / {{ label.max_repeat }})
            <span>
              <font-awesome-icon
                v-if="keyCounts[label.key] < label.max_repeat"
                role="button"
                class="text-muted ms-2"
                :icon="['far', 'clone']"
                @click="duplicateLabel(label, labelIndex)"
              />
              <font-awesome-icon
                v-if="keyCounts[label.key] > 1"
                role="button"
                class="text-muted ms-2"
                :icon="['far', 'trash-can']"
                @click="deleteLabel(label, labelIndex)"
              />
            </span>
          </span>
          <sup v-if="hasAnnotation(label.annotation)" class="ms-1">
            <InlineToolTip info="Reset">
              <font-awesome-icon
                role="button"
                class="text-muted"
                :icon="['fas', 'delete-left']"
                @click="clearAnnotation(label)"
              />
            </InlineToolTip>
          </sup>
        </div>
        <div v-if="label.hint" class="text-muted" style="font-size: 0.875rem">
          {{ label.hint }}
        </div>
      </div>
      <div v-if="label.annotation">
        <template v-if="label.kind === 'bool'">
          <div style="width: 100px">
            <div
              :class="{
                'theme-toggle': true,
                'bg-false': label.annotation.value_bool === false,
                'bg-true': label.annotation.value_bool === true,
              }"
            >
              <label class="tristate-checkbox false">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="false"
                  v-model="label.annotation.value_bool"
                />
                <span class="checkmark" />
              </label>
              <label class="tristate-checkbox undetermined">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="undefined"
                  v-model="label.annotation.value_bool"
                  disabled
                />
                <span class="checkmark" />
              </label>
              <label class="tristate-checkbox true">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="true"
                  v-model="label.annotation.value_bool"
                />
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </template>

        <template v-else-if="label.kind === 'single'">
          <template v-if="label.dropdown">
            <SearchableSelect
              :options="label.choices as SelectOption[]"
              :current-option-value="label.annotation.value_int as number"
              @update:current-option="(newValue: number | undefined) => singleIntNewValue(newValue, label)"
            />
          </template>
          <template v-else>
            <div class="list-group">
              <label
                v-for="(choice, index) in label.choices"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ 'list-group-item-dark': label.annotation.value_int === choice.value }"
              >
                <input
                  type="radio"
                  class="form-check-input me-1"
                  v-bind:value="choice.value"
                  v-model="label.annotation.value_int"
                  @change="singleIntUpdate(label)"
                />
                <InlineToolTip :info="choice.hint as string">
                  <span class="ms-2">{{ choice.name }}</span>
                </InlineToolTip>
              </label>
            </div>
          </template>
          <div v-if="children(label)" class="ms-3 mt-2">
            <AnnotationLabels
              :labels="children(label)"
              :assignment="assignment"
              :key="label.annotation.value_int as number"
              :ref="`childLabels-${labelIndex}-${label.annotation.repeat || 0}`"
            />
          </div>
        </template>

        <template v-else-if="label.kind === 'multi'">
          <template v-if="label.dropdown && label.choices">
            <div class="mb-2">
              <closable-pill
                v-for="v in label.annotation.multi_int"
                :key="v"
                @clicked-x="multiIntUpdate(label, v)"
                colour="info"
                class="me-2"
              >
                {{ label.choices[v].name }}
              </closable-pill>
            </div>

            <SearchableSelect
              :reset-text="true"
              :options="label.choices as SelectOption[]"
              :hidden-options="label.annotation.multi_int as number[]"
              @update:currentOption="(selectedValue: number | undefined) => multiIntUpdate(label, selectedValue)"
            />
          </template>
          <template v-else>
            <div class="list-group">
              <label
                v-for="(choice, index) in label.choices"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ 'list-group-item-dark': multiIntContains(label.annotation, choice.value) }"
              >
                <input
                  type="checkbox"
                  class="form-check-input me-1"
                  :value="multiIntContains(label.annotation, choice.value)"
                  :checked="multiIntContains(label.annotation, choice.value)"
                  @change="multiIntUpdate(label, choice.value)"
                />
                <InlineToolTip :info="choice.hint as string">
                  <span class="ms-2">{{ choice.name }}</span>
                </InlineToolTip>
              </label>
            </div>
          </template>
          <div v-for="child in multiIntChildren(label)" :key="child.key" class="ms-3 mt-2">
            <AnnotationLabels
              :labels="child.labels"
              :assignment="assignment"
              :key="child.key"
              :ref="`childLabels-${labelIndex}-${label.annotation.repeat || 0}`"
            />
          </div>
        </template>

        <template v-else-if="label.kind === 'int'">
          <!-- TODO -->
          integer input not implemented yet
        </template>
        <template v-else-if="label.kind === 'float'">
          <!-- TODO -->
          float input not implemented yet
        </template>
        <template v-else-if="label.kind === 'str'">
          <textarea
            class="form-control"
            :id="`str-${label.key}-${label.annotation.repeat}`"
            :aria-label="label.name"
            rows="3"
            v-model="label.annotation.value_str"
          />
        </template>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
/* eslint no-param-reassign: "off" */
import { computed, getCurrentInstance, ref } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import SearchableSelect from "@/components/SearchableSelect.vue";
import type {
  AssignmentModel,
  AnnotationModel,
  AnnotationSchemeLabelChoice,
  AnnotationSchemeLabel,
} from "@/plugins/api/types";
import { AnnotationSchemeLabelKindEnum as KindEnum } from "@/plugins/api/types";
import ClosablePill from "@/components/ClosablePill.vue";
import { is } from "@/util";

type SubLabels = { labels: AnnotationSchemeLabel[]; key: number };

// structural copy of SearchableSelect's internal Option interface; the API label
// choices are passed through unchecked (as in the original Options API version),
// the API `null`s never reach the option fields at runtime
type SelectOption = { name: string; value: number; hint?: string; visible?: boolean };

// methods of the (recursive) AnnotationLabels children that are called through template refs
interface AnnotationLabelsExposed {
  selectNext(): number;
  selectPrevious(): number;
  setValue(v: string): void;
}

defineOptions({ name: "AnnotationLabels" });

const props = defineProps({
  labels: {
    type: Object as PropType<AnnotationSchemeLabel[]>,
    required: true,
    default: null,
  },
  assignment: {
    type: Object as PropType<AssignmentModel>,
    required: true,
    default: null,
  },
});

// dynamic `childLabels-*` template refs (used by selectNext/selectPrevious/setValue)
const instance = getCurrentInstance();
function childRefs(selectedIdx: number, repeat: number): AnnotationLabelsExposed[] {
  return instance!.refs[`childLabels-${selectedIdx}-${repeat}`] as unknown as AnnotationLabelsExposed[];
}

const selectedIdx = ref(-1);
const selectedChildIdx = ref(-1);

function selectNext(): number {
  // returns:
  //   0) parent should hold and do nothing
  //   1) reached end, parent should progress
  if (props.labels && props.labels.length > 0) {
    // Seems to be the first in this subtree
    if (selectedIdx.value < 0) {
      selectedIdx.value = 0;
      selectedChildIdx.value = -1;
      return 0;
    }

    const label = props.labels[selectedIdx.value];
    const childLabels = children(label);

    if (childLabels.length > 0) {
      // Encountered a label with children
      if (selectedChildIdx.value < 0) {
        selectedChildIdx.value = 0;
      }
      const refs = childRefs(selectedIdx.value, label.annotation?.repeat || 0);
      const action = refs[selectedChildIdx.value].selectNext();

      if (action > 0) {
        if (selectedChildIdx.value + 1 < childLabels.length) {
          selectedChildIdx.value += 1;
        } else {
          selectedChildIdx.value = -1;
          selectedIdx.value += 1;
        }
      }
      return action;
    }

    // Encountered a label without children
    selectedChildIdx.value = -1;
    if (selectedIdx.value + 1 >= props.labels.length) {
      // reached last label, resetting and tell parent to proceed
      selectedIdx.value = -1;
      return 1;
    }
    // continue to next label and tell parent to wait
    selectedIdx.value += 1;
    return 0;
  }
  return 1;
}
function selectPrevious(): number {
  // returns:
  //   0) parent should hold and do nothing
  //   1) reached end, parent should progress
  if (props.labels && props.labels.length > 0) {
    // Seems to be the first in this subtree, jump to last
    if (selectedIdx.value < 0) {
      selectedIdx.value = props.labels.length - 1;
      selectedChildIdx.value = -1;
      return 0;
    }

    const label = props.labels[selectedIdx.value];
    const childLabels = children(label);

    if (childLabels.length > 0) {
      // Encountered a label with children
      if (selectedChildIdx.value < 0) {
        selectedChildIdx.value = childLabels.length - 1;
      }
      // FIXME: this may jump two levels upwards at once without properly clearing each child
      const refs = childRefs(selectedIdx.value, label.annotation?.repeat || 0);
      const action = refs[selectedChildIdx.value].selectPrevious();

      if (action > 0) {
        if (selectedChildIdx.value - 1 < 0) {
          selectedChildIdx.value -= 1;
        } else {
          selectedChildIdx.value = -1;
          selectedIdx.value -= 1;
        }
      }
      return action;
    }

    // Encountered a label without children
    selectedChildIdx.value = -1;
    if (selectedIdx.value - 1 < 0) {
      // reached first label, resetting and tell parent to proceed
      selectedIdx.value = -1;
      return 1;
    }
    // continue to next label and tell parent to wait
    selectedIdx.value -= 1;
    return 0;
  }
  return 1;
}
function setValue(v: string) {
  const selectedLabel = props.labels[selectedIdx.value];
  if (selectedLabel) {
    if (selectedChildIdx.value >= 0) {
      // refer all actions to selected child
      const refs = childRefs(selectedIdx.value, selectedLabel.annotation?.repeat || 0);
      refs[selectedChildIdx.value].setValue(v);
    } else if (v === "Backspace") {
      clearAnnotation(selectedLabel);
    } else if (v === "+") {
      duplicateLabel(selectedLabel, selectedIdx.value);
    } else if (v === "-") {
      deleteLabel(selectedLabel, selectedIdx.value);
    } else if (selectedLabel.kind === "bool") {
      if (v === "0" || v === "2") {
        selectedLabel.annotation!.value_bool = false;
      } else if (v === "1") {
        selectedLabel.annotation!.value_bool = true;
      }
    } else if (selectedLabel.kind === "single") {
      if (v === "0") {
        singleIntNewValue(0, selectedLabel);
      } else if (v === "1") {
        singleIntNewValue(1, selectedLabel);
      } else if (v === "2") {
        singleIntNewValue(2, selectedLabel);
      } else if (v === "3") {
        singleIntNewValue(3, selectedLabel);
      } else if (v === "4") {
        singleIntNewValue(4, selectedLabel);
      } else if (v === "5") {
        singleIntNewValue(5, selectedLabel);
      } else if (v === "6") {
        singleIntNewValue(6, selectedLabel);
      } else if (v === "7") {
        singleIntNewValue(7, selectedLabel);
      } else if (v === "8") {
        singleIntNewValue(8, selectedLabel);
      } else if (v === "9") {
        singleIntNewValue(9, selectedLabel);
      }
    } else if (selectedLabel.kind === "multi") {
      if (v === "0") {
        multiIntUpdate(selectedLabel, 0);
      } else if (v === "1") {
        multiIntUpdate(selectedLabel, 1);
      } else if (v === "2") {
        multiIntUpdate(selectedLabel, 2);
      } else if (v === "3") {
        multiIntUpdate(selectedLabel, 3);
      } else if (v === "4") {
        multiIntUpdate(selectedLabel, 4);
      } else if (v === "5") {
        multiIntUpdate(selectedLabel, 5);
      } else if (v === "6") {
        multiIntUpdate(selectedLabel, 6);
      } else if (v === "7") {
        multiIntUpdate(selectedLabel, 7);
      } else if (v === "8") {
        multiIntUpdate(selectedLabel, 8);
      } else if (v === "9") {
        multiIntUpdate(selectedLabel, 9);
      }
    }
  }
  console.log(`Set value to ${v}`);
}
function clearAnnotation(label: AnnotationSchemeLabel) {
  // recurse clearance to children (if present)
  if ((label.kind === KindEnum.SINGLE || label.kind === KindEnum.MULTI) && label.choices) {
    label.choices.forEach((choice: AnnotationSchemeLabelChoice) => {
      choice.children?.forEach((childLabel: AnnotationSchemeLabel) => {
        clearAnnotation(childLabel);
      });
    });
  }

  if (label.annotation) {
    label.annotation.value_int = undefined;
    label.annotation.value_bool = undefined;
    label.annotation.value_str = undefined;
    label.annotation.value_float = undefined;
    label.annotation.multi_int = undefined;
    label.annotation.annotation_id = undefined;
  }
}
function hasAnnotation(annotation: AnnotationModel): boolean {
  return (
    annotation.value_int !== undefined ||
    annotation.value_str !== undefined ||
    annotation.value_bool !== undefined ||
    annotation.value_float !== undefined ||
    annotation.multi_int !== undefined
  );
}
function multiIntContains(annotation: AnnotationModel, value: number): boolean {
  if (!annotation.multi_int) return false;
  return annotation.multi_int.indexOf(value) >= 0;
}
function singleIntUpdate(label: AnnotationSchemeLabel) {
  const index = val2choice(label);
  if (index !== undefined) {
    if (label.choices) {
      label.choices[index].children?.forEach((lab: AnnotationSchemeLabel) => {
        clearAnnotation(lab);
      });
    }
  }
}
function singleIntNewValue(value: number | undefined, label: AnnotationSchemeLabel) {
  label.annotation!.value_int = value;
  singleIntUpdate(label);
}
function multiIntUpdate(label: AnnotationSchemeLabel, value: number | undefined) {
  if (value !== undefined) {
    const { annotation } = label;
    if (annotation) {
      if (!annotation.multi_int) annotation.multi_int = [];
      const index = annotation.multi_int.indexOf(value);
      if (index >= 0) {
        annotation.multi_int.splice(index, 1);
        // propagate deletion to the children of the removed choice
        // (index is the position within multi_int, so the choice must be found by value)
        const choiceIndex = label.choices?.findIndex((c) => c.value === value);
        if (choiceIndex !== undefined && choiceIndex >= 0) {
          label.choices![choiceIndex].children?.forEach((lab: AnnotationSchemeLabel) => {
            clearAnnotation(lab);
          });
        }
      } else {
        annotation.multi_int.push(value);
      }
      if (annotation.multi_int.length === 0) annotation.multi_int = undefined;
    }
  }
}
function multiIntChildren(label: AnnotationSchemeLabel): Array<SubLabels> {
  function hasLabels(child: SubLabels | undefined): child is SubLabels {
    return child !== undefined;
  }

  if (!label.annotation?.multi_int) return [];
  return label.annotation.multi_int
    .map((key) => {
      const choice = label.choices!.findIndex((c) => c.value === key);
      if (label.choices && label.choices[choice]) {
        const { children } = label.choices[choice];
        if (children) {
          return {
            labels: children,
            key,
          };
        }
      }
      return undefined;
    })
    .filter(hasLabels);
}
function duplicateLabel(label: AnnotationSchemeLabel, labelIndex: number) {
  if (keyCounts.value[label.key] < (label.max_repeat ?? 1)) {
    // copy the current label and remove irrelevant things
    const labelCopy = JSON.parse(JSON.stringify(label)) as AnnotationSchemeLabel;
    if (labelCopy.annotation) clearAnnotation(labelCopy);

    props.labels.splice(labelIndex + 1, 0, labelCopy);

    // update all repeat counts as things may have been reordered
    updateRepeatCounts(label.key);
  }
}
function deleteLabel(label: AnnotationSchemeLabel, labelIndex: number) {
  if (keyCounts.value[label.key] > 1) {
    props.labels.splice(labelIndex, 1);

    // update all repeat counts as things may have been reordered
    updateRepeatCounts(label.key);
  }
}
function updateRepeatCounts(key: string) {
  let run = 1;
  props.labels.forEach((label: AnnotationSchemeLabel) => {
    if (label.key === key) {
      if (label.annotation) label.annotation.repeat = run;
      run += 1;
    }
  });
}
function val2choice(label: AnnotationSchemeLabel): number | undefined {
  const value: number | null | undefined = label.annotation?.value_int;
  if (is<number>(value)) {
    const idx = label.choices?.findIndex((choice) => choice.value === value);
    if (idx !== undefined && idx >= 0) {
      return idx;
    }
  }
  return undefined;
}
function children(label: AnnotationSchemeLabel): AnnotationSchemeLabel[] {
  const choice = val2choice(label);
  if (label.choices && choice !== undefined && label.choices[choice]) {
    const { children } = label.choices[choice];
    if (is<AnnotationSchemeLabel[]>(children)) {
      return children;
    }
  }
  return [];
}

const keyCounts = computed(() => {
  return props.labels.reduce((keyCounts: { [key: string]: number }, label: AnnotationSchemeLabel) => {
    if (!(label.key in keyCounts)) {
      keyCounts[label.key] = 0;
    }
    keyCounts[label.key] += 1;
    return keyCounts;
  }, {});
});

// the parent view (AnnotationsView) and the recursive template refs call these methods
defineExpose({ selectNext, selectPrevious, setValue });
</script>

<style scoped>
.selected > div > div > .label-name {
  color: red;
  border-left: 4px solid rebeccapurple;
  padding-left: 6px;
}

.theme-toggle {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.tristate-checkbox {
  --border-thickness: 1px;
  --radio-size: 20px;
  --undetermined-size: 2px;
  --border-color: #444;
  width: calc(var(--radio-size) - (2 * var(--border-thickness)));
  height: var(--radio-size);
  border-top: var(--border-thickness) solid var(--border-color);
  border-bottom: var(--border-thickness) solid var(--border-color);
  justify-content: center;
  align-items: center;
}

.tristate-checkbox.undetermined {
  width: var(--undetermined-size);
}

.theme-toggle.bg-false > .tristate-checkbox {
  background-color: hsl(6, 63%, 50%);
}

.theme-toggle.bg-true > .tristate-checkbox {
  background-color: hsl(105, 64%, 37%);
}

.tristate-checkbox.false {
  width: calc(var(--radio-size) - var(--border-thickness));
  border-left: var(--border-thickness) solid var(--border-color);
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
}

.tristate-checkbox.true {
  width: calc(var(--radio-size) - var(--border-thickness));
  border-right: var(--border-thickness) solid var(--border-color);
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}

.tristate-checkbox input {
  display: none;
}

.tristate-checkbox .checkmark {
  width: calc(var(--radio-size) - (4 * var(--border-thickness)));
  height: calc(var(--radio-size) - (4 * var(--border-thickness)));
  border-radius: 50%;
  display: inline-block;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-color: white;
}

.tristate-checkbox.undetermined .checkmark {
  background-color: hsl(7, 4%, 58%);
}

.tristate-checkbox input:checked + .checkmark {
  opacity: 1;
  display: inline-block;
}

.tristate-checkbox.false .checkmark {
  margin-left: var(--border-thickness);
}

.tristate-checkbox.undetermined input:checked + .checkmark {
  transform: translateX(calc(0px - var(--undetermined-size) / 2 - (6 * var(--border-thickness))));
}
</style>
