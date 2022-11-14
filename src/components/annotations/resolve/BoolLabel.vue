<template>
  <div>
    <span v-for="(value, user_i) in userAnnotations" :key="user_i">
      <InlineToolTip :info="annotation2string(value)">
        <font-awesome-icon
          :icon="['fas', annotation2icon(value)]"
          :class="[annotation2classes(value)]"
          class="border text-light p-1"
          style="height: 1rem; width: 1rem;" />
      </InlineToolTip>
    </span>
    <div class="dropdown ps-2 d-inline">
      <font-awesome-icon
        :icon="['fas', annotation2icon(botAnnotation)]"
        :class="annotation2classes(botAnnotation)"
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
      required: false,
      default: () => undefined,
    },
  },
  methods: {
    annotation2icon(val: AnnotationModel | BotAnnotationModel | undefined): string {
      if (val === undefined || val.value_bool === undefined) return 'question';
      return (val.value_bool) ? 'check' : 'xmark';
    },
    annotation2classes(val: AnnotationModel | BotAnnotationModel | undefined): string[] {
      if (val === undefined || val.value_bool === undefined) return ['bg-light', 'text-dark'];
      return (val.value_bool) ? ['bg-success', 'text-light'] : ['bg-danger', 'text-light'];
    },
    annotation2string(val: AnnotationModel | BotAnnotationModel | undefined) {
      if (val === undefined || val.value_bool === undefined) return '[MISSING]';
      let user = '';
      if ('user_id' in val) {
        user = `${this.users[val.user_id].username}: `;
      }
      return `${user}${(val.value_bool) ? 'Yes' : 'No'}`;
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
    // pass
  },
};
</script>
