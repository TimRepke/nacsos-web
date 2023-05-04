<template>
  <div class="d-flex flex-column">
    <div
      class="d-flex flex-row card"
      :class="{ 'rounded-0': dropdownVisible, 'rounded-top': dropdownVisible }">
      <div class="ms-1 flex-grow-1">
        <input
          class="w-100"
          type="text"
          v-model="searchText"
          @focusin="dropdownVisible = true"
          @focusout="unfocusSearchField"
          style="background-color: inherit; border:none;" />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'caret-down']" @click="dropdownVisible = !dropdownVisible" />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'circle-xmark']" @click="clear" />
      </div>
    </div>
    <div v-show="dropdownVisible">
      <ul class="list-group rounded-0 rounded-bottom border-top-0 overflow-auto" style="max-height: 10rem;">
        <li
          v-for="option in dropdownOptions"
          :key="`opt-${option.name}-${option.value}`"
          class="list-group-item list-group-item-action"
          @click="pickOption(option)">
          <InlineToolTip :info="option.hint">
            {{ option.name }}
          </InlineToolTip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import InlineToolTip from '@/components/InlineToolTip.vue';

interface Option {
  name: string;
  value: number;
  hint?: string;
}

export default defineComponent({
  name: 'SearchableSelect',
  components: { InlineToolTip },
  emits: ['update:current-option'],
  props: {
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
  },
  data() {
    return {
      searchText: '',
      dropdownOptions: this.options,
      dropdownVisible: false,
    };
  },
  computed: {
    // pass
  },
  methods: {
    unfocusSearchField() {
      setTimeout(() => {
        // create a small delay, because otherwise the list entry someone clicked on is gone before the
        // event propagates and to JS it looks like the user clicked into thin air
        this.dropdownVisible = false;
      }, 100);
    },
    resetDropdownOptions() {
      this.dropdownOptions = this.options;
    },
    filterDropdownOptions() {
      this.dropdownOptions = this.options.filter(
        (option: Option) => option.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
          && (this.hiddenOptions ?? []).indexOf(option.value) < 0,
      );
    },
    clear() {
      this.searchText = '';
      this.$emit('update:current-option', undefined);
    },
    pickOption(option: Option) {
      if (!this.resetText) {
        this.searchText = option.name;
      }
      this.$emit('update:current-option', option.value);
      this.dropdownVisible = false;
    },
  },
  watch: {
    searchText(newValue: string) {
      if (newValue.length === 0) {
        this.resetDropdownOptions();
      } else {
        this.filterDropdownOptions();
      }
    },
    hiddenOptions: {
      handler() {
        this.filterDropdownOptions();
      },
      deep: true,
    },
  },
});
</script>

<style scoped>

</style>
