<template>
  <div v-if="userAnnotations !== undefined">
    <span v-for="(value, user_i) in userAnnotations" :key="user_i">
      <InlineToolTip :info="val2str(value)">
        <span
          class="border text-light p-1"
          :style="{ backgroundColor: val2col(value) }">
          <template v-if="value === null">
            <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
          </template>
          <template v-else>
            {{ value[TupleInd.V_INT] }}
          </template>
        </span>
      </InlineToolTip>
    </span>
    <span v-if="botAnnotation !== undefined">
      {{ botAnnotation.value_int }}
    </span>
  </div>
  <div v-else>
    --
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

interface ChoiceLabelData {
  TupleInd: typeof Value,
}

export default {
  name: 'ChoiceLabel',
  components: { InlineToolTip },
  data(): ChoiceLabelData {
    return {
      TupleInd: Value,
    };
  },
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
    val2str(val: AnnotationValueTuple | null) {
      if (val === null) return '[MISSING]';
      const { name, value } = this.choiceLookup[val[Value.V_INT]];
      return `${name} (${value})`;
    },
    val2col(val: AnnotationValueTuple | null) {
      if (val === null) return 'transparent';
      return this.cmap[val[Value.V_INT] % this.cmap.length];
    },
  },
  computed: {
    cmap(): string[] {
      return (this.info.choices.length > 10) ? cmap20 : cmap10;
    },
  },
};
</script>
