<template>
  <ul class="list-unstyled">
    <li
      v-for="(label, labelIndex) in labels"
      :key="`${label.key}-${label.annotation.repeat}`"
      class="mb-3"
      :class="{ selected: labelIndex === selectedIdx && selectedChildIdx < 0 }">
      <div
        class="mb-2"
        v-if="label.annotation !== undefined && label.annotation !== null && label.max_repeat !== null && label.max_repeat !== undefined">
        <div>
          <strong class="label-name">{{ label.name }}</strong>
          <span v-if="label.max_repeat > 1" style="font-size: .875rem">
            ({{ label.annotation.repeat }} / {{ label.max_repeat }})
            <span>
              <font-awesome-icon
                v-if="keyCounts[label.key] < label.max_repeat"
                role="button"
                class="text-muted ms-2"
                :icon="['far', 'clone']"
                @click="duplicateLabel(label, labelIndex)" />
              <font-awesome-icon
                v-if="keyCounts[label.key] > 1"
                role="button"
                class="text-muted ms-2"
                :icon="['far', 'trash-can']"
                @click="deleteLabel(label, labelIndex)" />
            </span>
          </span>
          <sup v-if="hasAnnotation(label.annotation)" class="ms-1">
            <InlineToolTip info="Reset">
              <font-awesome-icon
                role="button"
                class="text-muted"
                :icon="['fas', 'delete-left']"
                @click="clearAnnotation(label)" />
            </InlineToolTip>
          </sup>
        </div>
        <div v-if="label.hint" class="text-muted" style="font-size: .875rem">
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
              }">
              <label class="tristate-checkbox false">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="false"
                  v-model="label.annotation.value_bool" />
                <span class="checkmark" />
              </label>
              <label class="tristate-checkbox undetermined">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="undefined"
                  v-model="label.annotation.value_bool"
                  disabled />
                <span class="checkmark" />
              </label>
              <label class="tristate-checkbox true">
                <input
                  type="radio"
                  :name="`toggle-state-${label.annotation.key}-${label.annotation.repeat}`"
                  v-bind:value="true"
                  v-model="label.annotation.value_bool" />
                <span class="checkmark" />
              </label>
            </div>
          </div>
        </template>

        <template v-else-if="label.kind === 'single'">
          <template v-if="label.dropdown">
            <SearchableSelect
              :options="label.choices"
              :current-option-value="label.annotation.value_int"
              @update:current-option="(newValue: number | undefined) => singleIntNewValue(newValue, label)" />
          </template>
          <template v-else>
            <div class="list-group">
              <label
                v-for="(choice, index) in label.choices"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ 'list-group-item-dark': label.annotation.value_int === choice.value }">
                <input
                  type="radio"
                  class="form-check-input me-1"
                  v-bind:value="choice.value"
                  v-model="label.annotation.value_int"
                  @change="singleIntUpdate(label)" />
                <InlineToolTip :info="choice.hint">
                  <span class="ms-2">{{ choice.name }}</span>
                </InlineToolTip>
              </label>
            </div>
          </template>
          <div
            v-if="children(label)"
            class="ms-3 mt-2">
            <AnnotationLabels
              :labels="children(label)"
              :assignment="assignment"
              :key="label.annotation.value_int"
              :ref="`childLabels-${labelIndex}-${label.annotation.repeat || 0}`" />
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
                class="me-2">
                {{ label.choices[v].name }}
              </closable-pill>
            </div>

            <SearchableSelect
              :reset-text="true"
              :options="label.choices"
              :hidden-options="label.annotation.multi_int"
              @update:currentOption="(selectedValue: number | undefined) => multiIntUpdate(label, selectedValue)" />
          </template>
          <template v-else>
            <div class="list-group">
              <label
                v-for="(choice, index) in label.choices"
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ 'list-group-item-dark': multiIntContains(label.annotation, choice.value) }">
                <input
                  type="checkbox"
                  class="form-check-input me-1"
                  :value="multiIntContains(label.annotation, choice.value)"
                  :checked="multiIntContains(label.annotation, choice.value)"
                  @change="multiIntUpdate(label, choice.value)" />
                <InlineToolTip :info="choice.hint">
                  <span class="ms-2">{{ choice.name }}</span>
                </InlineToolTip>
              </label>
            </div>
          </template>
          <div
            v-for="child in multiIntChildren(label)"
            :key="child.key"
            class="ms-3 mt-2">
            <AnnotationLabels
              :labels="child.labels"
              :assignment="assignment"
              :key="child.key"
              :ref="`childLabels-${labelIndex}-${label.annotation.repeat || 0}`" />
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
            v-model="label.annotation.value_str" />
        </template>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
/* eslint no-param-reassign: "off" */
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import InlineToolTip from '@/components/InlineToolTip.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import type { AssignmentModel, AnnotationModel, AnnotationSchemeLabelChoice } from '@/plugins/api/api-core';
import { AnnotationSchemeLabel } from '@/plugins/api/api-core';
import ClosablePill from '@/components/ClosablePill.vue';
import { is, isNone } from '@/util';

type SubLabels = { labels: AnnotationSchemeLabel[]; key: number; };

const AnnotationLabels = defineComponent({
  name: 'AnnotationLabels',
  components: { ClosablePill, InlineToolTip, SearchableSelect },
  props: {
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
  },
  data() {
    return {
      selectedIdx: -1,
      selectedChildIdx: -1,
    };
  },
  methods: {
    selectNext(): number {
      // returns:
      //   0) parent should hold and do nothing
      //   1) reached end, parent should progress
      if (this.labels && this.labels.length > 0) {
        // Seems to be the first in this subtree
        if ((this.selectedIdx < 0)) {
          this.selectedIdx = 0;
          this.selectedChildIdx = -1;
          return 0;
        }

        const label = this.labels[this.selectedIdx];
        const children = this.children(label);

        if (children.length > 0) {
          // Encountered a label with children
          if (this.selectedChildIdx < 0) {
            this.selectedChildIdx = 0;
          }
          const refs = this.$refs[`childLabels-${this.selectedIdx}-${label.annotation?.repeat || 0}`] as typeof AnnotationLabels[];
          const action = refs[this.selectedChildIdx].selectNext();

          if (action > 0) {
            if ((this.selectedChildIdx + 1) < children.length) {
              this.selectedChildIdx += 1;
            } else {
              this.selectedChildIdx = -1;
              this.selectedIdx += 1;
            }
          }
          return action;
        }

        // Encountered a label without children
        this.selectedChildIdx = -1;
        if ((this.selectedIdx + 1) >= this.labels.length) {
          // reached last label, resetting and tell parent to proceed
          this.selectedIdx = -1;
          return 1;
        }
        // continue to next label and tell parent to wait
        this.selectedIdx += 1;
        return 0;
      }
      return 1;
    },
    selectPrevious() {
      // returns:
      //   0) parent should hold and do nothing
      //   1) reached end, parent should progress
      if (this.labels && this.labels.length > 0) {
        // Seems to be the first in this subtree, jump to last
        if (this.selectedIdx < 0) {
          this.selectedIdx = this.labels.length - 1;
          this.selectedChildIdx = -1;
          return 0;
        }

        const label = this.labels[this.selectedIdx];
        const children = this.children(label);

        if (children.length > 0) {
          // Encountered a label with children
          if (this.selectedChildIdx < 0) {
            this.selectedChildIdx = children.length - 1;
          }
          const refs = this.$refs[`childLabels-${this.selectedIdx}-${label.annotation?.repeat || 0}`] as typeof AnnotationLabels[];
          const action = refs[this.selectedChildIdx].selectPrevious();

          if (action > 0) {
            if ((this.selectedChildIdx - 1) < 0) {
              this.selectedChildIdx -= 1;
            } else {
              this.selectedChildIdx = -1;
              this.selectedIdx -= 1;
            }
          }
          return action;
        }

        // Encountered a label without children
        this.selectedChildIdx = -1;
        if ((this.selectedIdx - 1) < 0) {
          // reached first label, resetting and tell parent to proceed
          this.selectedIdx = -1;
          return 1;
        }
        // continue to next label and tell parent to wait
        this.selectedIdx -= 1;
        return 0;
      }
      return 1;
    },
    setValue(v: string) {
      const selectedLabel = this.labels[this.selectedIdx];
      if (selectedLabel) {
        if (this.selectedChildIdx >= 0) {
          // refer all actions to selected child
          const refs = this.$refs[`childLabels-${this.selectedIdx}-${selectedLabel.annotation?.repeat || 0}`] as typeof AnnotationLabels[];
          refs[this.selectedChildIdx].setValue(v);
        } else if (v === 'Backspace') {
          this.clearAnnotation(selectedLabel);
        } else if (v === '+') {
          this.duplicateLabel(selectedLabel, this.selectedIdx);
        } else if (v === '-') {
          this.deleteLabel(selectedLabel, this.selectedIdx);
        } else if (selectedLabel.kind === 'bool') {
          if (v === '0' || v === '2') {
            selectedLabel.annotation!.value_bool = false;
          } else if (v === '1') {
            selectedLabel.annotation!.value_bool = true;
          }
        } else if (selectedLabel.kind === 'single') {
          if (v === '0') {
            this.singleIntNewValue(0, selectedLabel);
          } else if (v === '1') {
            this.singleIntNewValue(1, selectedLabel);
          } else if (v === '2') {
            this.singleIntNewValue(2, selectedLabel);
          } else if (v === '3') {
            this.singleIntNewValue(3, selectedLabel);
          } else if (v === '4') {
            this.singleIntNewValue(4, selectedLabel);
          } else if (v === '5') {
            this.singleIntNewValue(5, selectedLabel);
          } else if (v === '6') {
            this.singleIntNewValue(6, selectedLabel);
          } else if (v === '7') {
            this.singleIntNewValue(7, selectedLabel);
          } else if (v === '8') {
            this.singleIntNewValue(8, selectedLabel);
          } else if (v === '9') {
            this.singleIntNewValue(9, selectedLabel);
          }
        } else if (selectedLabel.kind === 'multi') {
          if (v === '0') {
            this.multiIntUpdate(selectedLabel, 0);
          } else if (v === '1') {
            this.multiIntUpdate(selectedLabel, 1);
          } else if (v === '2') {
            this.multiIntUpdate(selectedLabel, 2);
          } else if (v === '3') {
            this.multiIntUpdate(selectedLabel, 3);
          } else if (v === '4') {
            this.multiIntUpdate(selectedLabel, 4);
          } else if (v === '5') {
            this.multiIntUpdate(selectedLabel, 5);
          } else if (v === '6') {
            this.multiIntUpdate(selectedLabel, 6);
          } else if (v === '7') {
            this.multiIntUpdate(selectedLabel, 7);
          } else if (v === '8') {
            this.multiIntUpdate(selectedLabel, 8);
          } else if (v === '9') {
            this.multiIntUpdate(selectedLabel, 9);
          }
        }
      }
      console.log(`Set value to ${v}`);
    },
    clearAnnotation(label: AnnotationSchemeLabel) {
      // recurse clearance to children (if present)
      if ((label.kind === AnnotationSchemeLabel.kind.SINGLE
          || label.kind === AnnotationSchemeLabel.kind.MULTI)
        && label.choices) {
        label.choices.forEach((choice: AnnotationSchemeLabelChoice) => {
          choice.children?.forEach((childLabel: AnnotationSchemeLabel) => {
            this.clearAnnotation(childLabel);
          });
        });
      }

      if (label.annotation) {
        label.annotation.value_int = undefined;
        label.annotation.value_bool = undefined;
        label.annotation.value_str = undefined;
        label.annotation.value_float = undefined;
        label.annotation.multi_int = undefined;
      }
    },
    hasAnnotation(annotation: AnnotationModel): boolean {
      return annotation.value_int !== undefined
        || annotation.value_str !== undefined
        || annotation.value_bool !== undefined
        || annotation.value_float !== undefined
        || annotation.multi_int !== undefined;
    },
    multiIntContains(annotation: AnnotationModel, value: number): boolean {
      if (!annotation.multi_int) return false;
      return annotation.multi_int.indexOf(value) >= 0;
    },
    singleIntUpdate(label: AnnotationSchemeLabel) {
      const index = this.val2choice(label);
      if (index !== undefined) {
        if (label.choices) {
          label.choices[index].children?.forEach((lab: AnnotationSchemeLabel) => {
            this.clearAnnotation(lab);
          });
        }
      }
    },
    singleIntNewValue(value: number | undefined, label: AnnotationSchemeLabel) {
      label.annotation!.value_int = value;
      this.singleIntUpdate(label);
    },
    multiIntUpdate(label: AnnotationSchemeLabel, value: number | undefined) {
      if (value !== undefined) {
        const { annotation } = label;
        if (annotation) {
          if (!annotation.multi_int) annotation.multi_int = [];
          const index = annotation.multi_int.indexOf(value);
          if (index >= 0) {
            annotation.multi_int.splice(index, 1);
            // propagate deletion to children
            if (label.choices) {
              label.choices[index].children?.forEach((lab: AnnotationSchemeLabel) => {
                this.clearAnnotation(lab);
              });
            }
          } else {
            annotation.multi_int.push(value);
          }
          if (annotation.multi_int.length === 0) annotation.multi_int = undefined;
        }
      }
    },
    multiIntChildren(label: AnnotationSchemeLabel): Array<SubLabels> {
      function hasLabels(child: SubLabels | undefined): child is SubLabels {
        return child !== undefined;
      }

      if (!label.annotation?.multi_int) return [];
      return label.annotation.multi_int.map((key) => {
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
      }).filter(hasLabels);
    },
    duplicateLabel(label: AnnotationSchemeLabel, labelIndex: number) {
      if (this.keyCounts[label.key] < (label.max_repeat ?? 1)) {
        // copy the current label and remove irrelevant things
        const labelCopy = JSON.parse(JSON.stringify(label)) as AnnotationSchemeLabel;
        if (labelCopy.annotation) this.clearAnnotation(labelCopy);

        // eslint-disable-next-line vue/no-mutating-props
        this.labels.splice(labelIndex + 1, 0, labelCopy);

        // update all repeat counts as things may have been reordered
        this.updateRepeatCounts(label.key);
      }
    },
    deleteLabel(label: AnnotationSchemeLabel, labelIndex: number) {
      if (this.keyCounts[label.key] > 1) {
        // eslint-disable-next-line vue/no-mutating-props
        this.labels.splice(labelIndex, 1);

        // update all repeat counts as things may have been reordered
        this.updateRepeatCounts(label.key);
      }
    },
    updateRepeatCounts(key: string) {
      let run = 1;
      this.labels.forEach((label: AnnotationSchemeLabel) => {
        if (label.key === key) {
          if (label.annotation) label.annotation.repeat = run;
          run += 1;
        }
      });
    },
    val2choice(label: AnnotationSchemeLabel): number | undefined {
      const value: number | null | undefined = label.annotation?.value_int;
      if (is<number>(value)) {
        const idx = label.choices?.findIndex((choice) => choice.value === value);
        if (idx !== undefined && idx >= 0) {
          return idx;
        }
      }
      return undefined;
    },
    children(label: AnnotationSchemeLabel): AnnotationSchemeLabel[] {
      const choice = this.val2choice(label);
      if (label.choices && choice !== undefined && label.choices[choice]) {
        const { children } = label.choices[choice];
        if (is<AnnotationSchemeLabel[]>(children)) {
          return children;
        }
      }
      return [];
    },
  },
  computed: {
    keyCounts() {
      return this.labels.reduce((keyCounts: { [key: string]: number }, label: AnnotationSchemeLabel) => {
        if (!(label.key in keyCounts)) {
          keyCounts[label.key] = 0;
        }
        keyCounts[label.key] += 1;
        return keyCounts;
      }, {});
    },
  },
});
export default AnnotationLabels;
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
