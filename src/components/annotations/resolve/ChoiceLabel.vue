<template>
  <div v-if="userAnnotations !== undefined">
    <span v-for="(value, user_i) in userAnnotations" :key="user_i">
      <InlineToolTip :info="val2str(value)">
        <span
          class="border text-light p-1"
          :style="{ backgroundColor: val2col(value) }">
          <template v-if="value === null || value === undefined">
            <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
          </template>
          <template v-else>
            {{ value[TupleInd.V_INT] }}
          </template>
        </span>
      </InlineToolTip>
    </span>
    <div class="dropdown ps-2 d-inline">
      <span
        class="border text-light p-1 border-dark border-2 rounded-3 dropdown-toggle"
        :style="{ backgroundColor: botValueBgColor }"
        role="button"
        tabindex="-1"
        @click="editMode = !editMode">
        <template v-if="botAnnotation === undefined || botAnnotation.value_int === null || botAnnotation.value_int === undefined">
          <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
        </template>
        <template v-else>
          {{ botAnnotation.value_int }}
        </template>
      </span>
      <ul class="dropdown-menu" :class="{ show: editMode }">
        <li v-for="choice in info.choices" :key="choice.value">
          <span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(choice.value)">
            {{ choice.name }} ({{ choice.value }})
          </span>
        </li>
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
import {
  AnnotationSchemeLabelChoiceFlat,
  BotAnnotationModel,
  FlattenedAnnotationSchemeLabel,
} from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { PropType } from 'vue';
import { cmap10, cmap20 } from '@/types/colours';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';

interface ChoiceLabelData {
  TupleInd: typeof Value,
  editMode: boolean,
}

export default {
  name: 'ChoiceLabel',
  components: { InlineToolTip },
  data(): ChoiceLabelData {
    return {
      TupleInd: Value,
      editMode: false,
    };
  },
  emits: ['botAnnotationChanged', 'botAnnotationConfirmed'],
  props: {
    info: {
      type: Object as PropType<FlattenedAnnotationSchemeLabel>,
      required: true,
    },
    choiceLookup: {
      type: Object as PropType<Record<number, AnnotationSchemeLabelChoiceFlat>>,
      required: true,
    },
    users: {
      type: Array as PropType<string[]>,
      required: true,
    },
    userAnnotations: {
      type: Array as PropType<AnnotationValueTuple[]>,
      required: false,
      default: () => undefined,
    },
    botAnnotation: {
      type: Object as PropType<BotAnnotationModel>,
      required: false,
      default: () => undefined,
    },
  },
  methods: {
    safeValue(val: AnnotationValueTuple | number | null | undefined): number | undefined {
      if (val === null || val === undefined) return undefined;
      // is AnnotationValueTuple
      if (Array.isArray(val)) {
        const vInt = val[Value.V_INT];
        if (vInt === null || vInt === undefined) return undefined;
        return vInt;
      }
      // is number
      return val;
    },
    val2str(val: AnnotationValueTuple | number | null | undefined) {
      const vInt = this.safeValue(val);
      if (vInt === undefined) return '[MISSING]';
      const { name, value } = this.choiceLookup[vInt];
      return `${name} (${value})`;
    },
    val2col(val: AnnotationValueTuple | number | null | undefined) {
      const vInt = this.safeValue(val);
      if (vInt === undefined) return 'transparent';
      return this.cmap[vInt % this.cmap.length];
    },
    setBotAnnotation(value: number | undefined) {
      if (this.botAnnotation !== undefined) {
        const anno = this.botAnnotation;
        anno.value_int = value;
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
    cmap(): string[] {
      return (this.info.choices.length > 10) ? cmap20 : cmap10;
    },
    botValueBgColor() {
      if (this.botAnnotation === undefined) return 'transparent';
      if (this.botAnnotation.value_int === undefined) return 'transparent';
      return this.cmap[this.botAnnotation.value_int % this.cmap.length];
    },
  },
};
</script>
