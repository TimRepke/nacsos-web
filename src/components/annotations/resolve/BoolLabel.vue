<template>
  <div>
    <span v-for="(value, user_i) in userAnnotations" :key="user_i">
      <InlineToolTip :info="val2str(value)">
        <font-awesome-icon
          :icon="['fas', val2icon(value)]"
          :class="[val2bg(value)]"
          class="border text-light p-1"
          style="height: 1rem; width: 1rem;" />
      </InlineToolTip>
    </span>
    <div class="dropdown ps-2 d-inline">
      <font-awesome-icon
        :icon="['fas', botValueIcon]"
        :class="botValueBgColor"
        class="border border-dark border-2 rounded-3 text-light p-1 dropdown-toggle"
        role="button"
        style="height: 1rem; width: 1rem;"
        @click="editMode = !editMode" />
      <ul class="dropdown-menu" :class="{ show: editMode }">
        <li><span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(true)">True</span></li>
        <li><span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(false)">False</span></li>
        <li><span
          class="dropdown-item"
          role="button"
          tabindex="-1"
          @click="setBotAnnotation(undefined)">[NONE]</span></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Value, AnnotationValueTuple } from '@/types/annotations';
import { BotAnnotationModel, FlattenedAnnotationSchemeLabel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { PropType } from 'vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';

interface BoolLabelData {
  changed: boolean,
  editMode: boolean,
}

export default {
  name: 'BoolLabel',
  components: { InlineToolTip },
  data(): BoolLabelData {
    return {
      // set to true when bot annotation was manipulated
      changed: false,
      editMode: false,
    };
  },
  emits: ['botAnnotationChanged'],
  props: {
    info: {
      type: Object as PropType<FlattenedAnnotationSchemeLabel>,
      required: true,
    },
    users: {
      type: Array as PropType<string[]>,
      required: true,
    },
    userAnnotations: {
      type: Array as PropType<AnnotationValueTuple[]>,
      required: true,
    },
    botAnnotation: {
      type: Object as PropType<BotAnnotationModel>,
      required: false,
      default: () => undefined,
    },
  },
  methods: {
    val2icon(val: AnnotationValueTuple | null | undefined) {
      if (val === null || val === undefined) return 'question';
      const vBool = val[Value.V_BOOL];
      if (vBool === null || vBool === undefined) return 'question';
      if (vBool) return 'check';
      return 'xmark';
    },
    val2bg(val: AnnotationValueTuple | null | undefined) {
      if (val === null || val === undefined) return ['bg-light', 'text-dark'];
      const vBool = val[Value.V_BOOL];
      if (vBool === null || vBool === undefined) return ['bg-light', 'text-dark'];
      if (vBool) return ['bg-success', 'text-light'];
      return ['bg-danger', 'text-light'];
    },
    val2str(val: AnnotationValueTuple | null | undefined) {
      if (val === null || val === undefined) return '[MISSING]';
      return (val[Value.V_BOOL]) ? 'Yes' : 'No';
    },
    setBotAnnotation(value: boolean | undefined) {
      if (this.botAnnotation !== undefined) {
        const anno = this.botAnnotation;
        anno.value_bool = value;
        this.$emit('botAnnotationChanged', anno);
        this.editMode = false;
      } else {
        // FIXME: not implemented (handle adding new BotAnnotation, i.e. handle the case where item has no annotation here)
        // const anno: BotAnnotationModel = {};
        EventBus.emit(new ToastEvent('WARN', 'Not implemented yet.'));
      }
    },
  },
  computed: {
    botValueIcon() {
      if (this.botAnnotation === undefined) return 'question';
      if (this.botAnnotation.value_bool === undefined) return 'question';
      return (this.botAnnotation.value_bool) ? 'check' : 'xmark';
    },
    botValueBgColor() {
      if (this.botAnnotation === undefined) return ['bg-light', 'text-dark'];
      if (this.botAnnotation.value_bool === undefined) return ['bg-light', 'text-dark'];
      return [(this.botAnnotation.value_bool) ? 'bg-success' : 'bg-danger', 'text-light'];
    },
  },
};
</script>
