<template>
  <div>
    <textarea
      v-if="botAnnotation && userAnnotations"
      class="form-control"
      :id="`txt-${info.key}-${userAnnotations[0].item_id}`"
      :aria-label="info.name"
      rows="3"
      :value="botAnnotation.value_str"
      @change="setBotAnnotation($event.target.value)" />
  </div>
</template>

<script lang="ts">
import type {
  AnnotationModel,
  BotAnnotationModel,
  FlattenedAnnotationSchemeLabel,
  UserModel,
} from '@/plugins/api/api-core';
import type { PropType } from 'vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { defineComponent } from 'vue';

interface BoolLabelData {
  changed: boolean,
  editMode: boolean,
}

export default defineComponent({
  name: 'StringLabel',
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
      type: Object as PropType<Record<string, UserModel>>,
      required: true,
    },
    userAnnotations: {
      type: Array as PropType<AnnotationModel[]>,
      required: true,
    },
    botAnnotation: {
      type: Object as PropType<BotAnnotationModel>,
      required: false,
      default: () => undefined,
    },
  },
  methods: {
    annotation2icon(val: boolean | undefined): string {
      if (val === undefined) return 'question';
      return (val) ? 'check' : 'xmark';
    },
    annotation2classes(val: boolean | undefined): string[] {
      if (val === undefined) return ['bg-light', 'text-dark'];
      return (val) ? ['bg-success', 'text-light'] : ['bg-danger', 'text-light'];
    },
    setBotAnnotation(value: string | undefined) {
      if (this.botAnnotation !== undefined) {
        const anno = this.botAnnotation;
        anno.value_str = value;
        this.$emit('botAnnotationChanged', anno);
        this.editMode = false;
      } else {
        // FIXME: not implemented (handle adding new BotAnnotation, i.e. handle the case where item has no annotation here)
        // const anno: BotAnnotationModel = {};
        EventBus.emit(new ToastEvent('WARN', 'Not implemented yet.'));
      }
    },
    getPrettyUsername(userId: string): string {
      const user: UserModel | undefined = this.users[userId];
      if (!user) return '??';
      return `${user.username} (${user.full_name})`;
    },
  },
  computed: {
    // pass
  },
});
</script>
