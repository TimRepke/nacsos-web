<template>
  <div>
    <span v-for="(value, user_i) in userAnnotations" :key="user_i">
      <InlineToolTip :info="val2str(value)">
        <template v-if="value === null">
          <font-awesome-icon
            :icon="['fas', 'question']"
            class="border p-1 bg-light"
            style="height: 1rem; width: 1rem;" />
        </template>
        <template v-else-if="value[TupleInd.V_BOOL]">
          <font-awesome-icon
            :icon="['fas', 'check']"
            class="border text-light p-1 bg-success"
            style="height: 1rem; width: 1rem;" />
        </template>
        <template v-else>
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="border text-light p-1 bg-danger"
            style="height: 1rem; width: 1rem;" />
        </template>
      </InlineToolTip>
    </span>
    <span v-if="botAnnotation !== undefined">
      {{ botAnnotation.value_bool }}
    </span>
  </div>

</template>

<script lang="ts">

import { Value, AnnotationValueTuple } from '@/types/annotations';
import { BotAnnotationModel, FlattenedAnnotationSchemeLabel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { PropType } from 'vue';

interface BoolLabelData {
  TupleInd: typeof Value,
}

export default {
  name: 'BoolLabel',
  components: { InlineToolTip },
  data(): BoolLabelData {
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
    val2str: (val: AnnotationValueTuple | null) => {
      if (val === null) return '[MISSING]';
      return (val[Value.V_BOOL]) ? 'Yes' : 'No';
    },
  },
};
</script>
