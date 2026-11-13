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
            v-if="visibleValues.has(option.value)"
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
import { onUnmounted, ref, watch } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";

interface Option {
  name: string;
  value: number;
  hint?: string;
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

const searchText = ref("");
const dropdownOptions = ref<Record<number, Option>>({});
const visibleValues = ref<Set<number>>(new Set());
const dropdownVisible = ref(false);
let searchTimer: ReturnType<typeof setTimeout> | undefined;
let blurTimer: ReturnType<typeof setTimeout> | undefined;

function isHidden(option: Option): boolean {
  return (props.hiddenOptions ?? []).indexOf(option.value) >= 0;
}
function rebuildOptions() {
  const mapped: Record<number, Option> = {};
  props.options.forEach((option: Option) => {
    mapped[option.value] = option;
  });
  dropdownOptions.value = mapped;
  syncSearchText();
  applySearchFilter();
}
function syncSearchText() {
  if (props.currentOptionValue === undefined) {
    searchText.value = "";
  } else if (props.currentOptionValue in dropdownOptions.value && !props.resetText) {
    searchText.value = dropdownOptions.value[props.currentOptionValue].name;
  }
}
function unfocusSearchField() {
  if (blurTimer !== undefined) {
    clearTimeout(blurTimer);
  }
  blurTimer = setTimeout(() => {
    blurTimer = undefined;
    // create a small delay, because otherwise the list entry someone clicked on is gone before the
    // event propagates and to JS it looks like the user clicked into thin air
    dropdownVisible.value = false;
  }, 200);
}
function resetDropdownOptions() {
  const visible = new Set<number>();
  Object.values(dropdownOptions.value).forEach((option: Option) => {
    if (!isHidden(option)) {
      visible.add(option.value);
    }
  });
  visibleValues.value = visible;
}
function filterDropdownOptions() {
  const visible = new Set<number>();
  const needle = searchText.value.toLowerCase();
  Object.values(dropdownOptions.value).forEach((option: Option) => {
    if (!isHidden(option) && option.name.toLowerCase().indexOf(needle) >= 0) {
      visible.add(option.value);
    }
  });
  visibleValues.value = visible;
}
function applySearchFilter() {
  if (searchText.value.length === 0) {
    resetDropdownOptions();
  } else {
    filterDropdownOptions();
  }
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

rebuildOptions();

watch(searchText, (newValue: string) => {
  if (searchTimer !== undefined) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    searchTimer = undefined;
    if (
      newValue.length === 0 ||
      (props.currentOptionValue !== undefined && newValue === dropdownOptions.value[props.currentOptionValue]?.name)
    ) {
      resetDropdownOptions();
    } else {
      filterDropdownOptions();
    }
  }, 200);
});
watch(
  () => props.options,
  () => {
    rebuildOptions();
  },
  { deep: true },
);
watch(
  () => props.currentOptionValue,
  () => {
    syncSearchText();
    applySearchFilter();
  },
);
watch(
  () => props.hiddenOptions,
  () => {
    filterDropdownOptions();
  },
  { deep: true },
);

onUnmounted(() => {
  if (searchTimer !== undefined) {
    clearTimeout(searchTimer);
  }
  if (blurTimer !== undefined) {
    clearTimeout(blurTimer);
  }
});
</script>

<style scoped></style>
