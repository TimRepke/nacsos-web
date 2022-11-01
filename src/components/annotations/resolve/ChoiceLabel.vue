<template>
  <div v-if="annotation !== null">
    <span v-for="(value, user_i) in annotation" :key="user_i">
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
  </div>
  <div v-else>
    --
  </div>
</template>

<script lang="ts">

import { Value, AnnotationValueTuple } from '@/types/annotations';
import { AnnotationSchemeLabelChoiceFlat, FlattenedAnnotationSchemeLabel } from '@/plugins/api/api-core';
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
    users: {
      type: Array as PropType<string[]>,
      required: true,
    },
    annotation: {
      type: Array as PropType<AnnotationValueTuple[]>,
      required: false,
      default: () => null,
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
    choiceLookup(): Record<number, AnnotationSchemeLabelChoiceFlat> {
      return Object.fromEntries(this.info.choices.map((choice: AnnotationSchemeLabelChoiceFlat) => [choice.value, choice]));
    },
    cmap(): string[] {
      return (this.info.choices.length > 10) ? cmap20 : cmap10;
    },
  },
};
</script>
