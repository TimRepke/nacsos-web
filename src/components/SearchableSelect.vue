<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row card" :class="{ 'rounded-0': dropdownVisible, 'rounded-top': dropdownVisible }">
      <div class="ms-1 flex-grow-1">
        <input
          class="w-100"
          type="text"
          aria-label="Label search field"
          v-model="searchText"
          @focusin="dropdownVisible = true"
          @focusout="unfocusSearchField"
          style="background-color: inherit; border: none"
        />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'caret-down']" @click="dropdownVisible = !dropdownVisible" />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'circle-xmark']" @click="clear" />
      </div>
    </div>
    <div v-show="dropdownVisible">
      <ul class="list-group rounded-0 rounded-bottom border-top-0 overflow-auto" style="max-height: 10rem">
        <template v-for="option in dropdownOptions" :key="`opt-${option.name}-${option.value}`">
          <li
            v-if="option.visible"
            class="list-group-item list-group-item-action"
            role="button"
            tabindex="0"
            @click="pickOption(option)"
            @keyup.enter="pickOption(option)"
            @keyup.space="pickOption(option)"
          >
            <InlineToolTip :info="option.hint"> {{ option.name }} ({{ option.value }})</InlineToolTip>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";

interface Option {
  name: string;
  value: number;
  hint?: string;
  visible?: boolean;
}

defineOptions({ name: "SearchableSelect" });

const emit = defineEmits(["update:current-option"]);

const props = defineProps({
  options: {
    type: Object as PropType<Option[]>,
    required: true,
    default: () => [] as Option[],
  },
  hiddenOptions: {
    type: Object as PropType<number[]>,
    required: false,
    default: () => [] as number[],
  },
  currentOptionValue: {
    type: Number,
    required: false,
    default: undefined,
  },
  resetText: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const mappedOptions = Object.fromEntries(
  props.options.map((option) => {
    option.visible = !isHidden(option);
    return [option.value, option];
  }),
);
const searchText = ref(
  props.currentOptionValue !== undefined && props.currentOptionValue in mappedOptions
    ? mappedOptions[props.currentOptionValue].name
    : "",
);
const dropdownOptions = ref(mappedOptions);
const dropdownVisible = ref(false);

function isHidden(option: Option): boolean {
  return (props.hiddenOptions ?? []).indexOf(option.value) >= 0;
}
function unfocusSearchField() {
  setTimeout(() => {
    // create a small delay, because otherwise the list entry someone clicked on is gone before the
    // event propagates and to JS it looks like the user clicked into thin air
    dropdownVisible.value = false;
  }, 200);
}
function resetDropdownOptions() {
  Object.entries<Option>(dropdownOptions.value).forEach((entry: [string, Option]) => {
    entry[1].visible = !isHidden(entry[1]);
  });
}
function filterDropdownOptions() {
  Object.entries<Option>(dropdownOptions.value).forEach((entry: [string, Option]) => {
    entry[1].visible = !isHidden(entry[1]) && entry[1].name.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0;
  });
}
function clear() {
  searchText.value = "";
  emit("update:current-option", undefined);
}
function pickOption(option: Option) {
  if (!props.resetText) {
    searchText.value = option.name;
  }
  emit("update:current-option", option.value);
  dropdownVisible.value = false;
}

watch(searchText, (newValue: string) => {
  setTimeout(() => {
    if (
      newValue.length === 0 ||
      (props.currentOptionValue !== undefined && newValue === dropdownOptions.value[props.currentOptionValue].name)
    ) {
      resetDropdownOptions();
    } else {
      filterDropdownOptions();
    }
  }, 200);
});
watch(
  () => props.hiddenOptions,
  () => {
    filterDropdownOptions();
  },
  { deep: true },
);
</script>

<style scoped></style>
