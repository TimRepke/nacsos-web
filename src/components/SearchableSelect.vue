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
          @focusout="dropdownVisible = false"
          style="background-color: inherit; border:none;" />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'caret-down']" @click="dropdownVisible = !dropdownVisible" />
      </div>
      <div class="text-muted me-2">
        <font-awesome-icon :icon="['fas', 'circle-xmark']" @click="clear" />
      </div>
    </div>
    <div v-if="dropdownVisible">
      <ul class="list-group rounded-0 rounded-bottom border-top-0 overflow-auto" style="max-height: 10rem;">
        <li
          v-for="option in dropdownOptions"
          :key="`opt-${option.name}-${option.value}`"
          @click="pickOption(option)"
          class="list-group-item list-group-item-action">
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

//  @input="$emit('update:modelValue', $event.target.value)"
export default defineComponent({
  name: 'SearchableSelect',
  components: { InlineToolTip },
  emits: ['update:currentOption'],
  props: {
    options: {
      type: Object as PropType<Option[]>,
      required: true,
      default: () => [] as Option[],
    },
    currentOption: {
      type: Number,
      required: true,
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
      dropdownVisible: true,
    };
  },
  computed: {
    // pass
  },
  methods: {
    resetDropdownOptions() {
      this.dropdownOptions = this.options;
    },
    filterDropdownOptions() {
      this.dropdownOptions = this.options.filter(
        (option: Option) => option.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0,
      );
    },
    clear() {
      this.searchText = '';
      this.$emit('update:currentOption', undefined);
    },
    pickOption(option: Option) {
      if (this.resetText) {
        this.searchText = option.name;
      }
      this.$emit('update:currentOption', option.value);
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
  },
});
</script>

<style scoped>
.pill-text > .btn-close {
  font-size: 0.5em;
}

.pill-text {
  vertical-align: middle;
  display: inline-block;
  /*height: 1.3em;*/
}

/*
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 0.7em;
  --bs-badge-font-weight: 500;
}
*/
</style>
