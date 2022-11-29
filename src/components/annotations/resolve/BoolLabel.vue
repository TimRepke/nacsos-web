<template>
  <div>
    <span v-for="annotation in userAnnotations" :key="annotation.annotation_id">
      <InlineToolTip :info="getPrettyUsername(annotation.user_id)">
        <font-awesome-icon
          :icon="['fas', annotation2icon(annotation.value_bool)]"
          :class="[annotation2classes(annotation.value_bool)]"
          class="border text-light p-1"
          style="height: 1rem; width: 1rem;" />
      </InlineToolTip>
    </span>

    <div class="dropdown ps-2 d-inline-block">
      <font-awesome-icon
        :icon="['fas', annotation2icon(botAnnotation.value_bool)]"
        :class="annotation2classes(botAnnotation.value_bool)"
        class="border border-dark border-2 rounded-3 text-light p-1 dropdown-toggle"
        role="button"
        style="height: 1rem; width: 1rem;"
        @click="editMode = !editMode" />
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
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
import { AnnotationModel, BotAnnotationModel, FlattenedAnnotationSchemeLabel, UserModel } from '@/plugins/api/api-core';
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
      type: Object as PropType<Record<string, UserModel>>,
      required: true,
    },
    userAnnotations: {
      type: Array as PropType<AnnotationModel[]>,
      required: true,
    },
    botAnnotation: {
      type: Object as PropType<BotAnnotationModel>,
      required: true,
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
    getPrettyUsername(userId: string): string {
      const user: UserModel | undefined = this.users[userId];
      if (!user) return '??';
      return `${user.username} (${user.full_name})`;
    },
  },
  computed: {
    // pass
  },
};
</script>
