<template>
  <div v-if="userAnnotations !== undefined">

    <!-- User Annotations -->
    <span v-for="annotation in userAnnotationsSorted" :key="annotation.annotation_id">
      <InlineToolTip :info="getPrettyIntLabelInfo(annotation)">
        <span
          class="border text-light p-1 ps-2 pe-2"
          :style="{ backgroundColor: annotation2bgColor(annotation) }">
          <template v-if="annotation.value_int === undefined">
            <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
          </template>
          <template v-else>
            {{ annotation.value_int }}
          </template>
        </span>
      </InlineToolTip>
    </span>
    <!-- / User Annotations -->

    <!-- BotAnnotation -->
    <div class="dropdown ps-2 d-inline-block">
      <span
        class="border text-light p-1 border-dark border-2 rounded-3 dropdown-toggle"
        :style="{ backgroundColor: annotation2bgColor(botAnnotation) }"
        role="button"
        tabindex="-1"
        @click="editMode = !editMode">
        <template v-if="!hasValue(botAnnotation)">
          <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
        </template>
        <template v-else>
          {{ botAnnotation.value_int }}
        </template>
      </span>
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
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
    <!-- / BotAnnotation -->

  </div>
</template>

<script lang="ts">

import 'core-js/modules/es.array.to-sorted';
import type {
  AnnotationModel,
  AnnotationSchemeLabelChoiceFlat,
  BotAnnotationModel,
  FlattenedAnnotationSchemeLabel,
  UserModel,
} from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import type { PropType } from 'vue';
import { cmap10, cmap20 } from '@/types/colours';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { defineComponent } from 'vue';

function hasValue(model: AnnotationModel | BotAnnotationModel | undefined | null):
  model is (AnnotationModel | BotAnnotationModel) & { value_int: number } {
  if (model === null || model === undefined) return false;
  return (model.value_int !== undefined && model.value_int !== null);
}

interface ChoiceLabelData {
  changed: boolean,
  editMode: boolean,
}

export default defineComponent({
  name: 'ChoiceLabel',
  components: { InlineToolTip },
  data(): ChoiceLabelData {
    return {
      changed: false,
      editMode: false,
    };
  },
  emits: ['botAnnotationChanged', 'botAnnotationConfirmed'],
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
    hasValue(model: AnnotationModel | BotAnnotationModel | undefined | null):
      model is (AnnotationModel | BotAnnotationModel) & { value_int: number } {
      return hasValue(model);
    },
    annotation2bgColor(val: AnnotationModel | BotAnnotationModel | undefined) {
      if (hasValue(val)) {
        return this.cmap[val.value_int % this.cmap.length];
      }
      return 'transparent';
    },
    setBotAnnotation(value: number | undefined) {
      if (this.botAnnotation !== undefined) {
        if (this.botAnnotation.value_int !== value) {
          this.changed = true;
          const anno = this.botAnnotation;
          anno.value_int = value;
          this.$emit('botAnnotationChanged', anno);
          this.editMode = false;
        }
      } else {
        // FIXME: not implemented (handle adding new BotAnnotation, i.e. handle the case where item has no annotation here)
        // const anno: BotAnnotationModel = {};
        EventBus.emit(new ToastEvent('WARN', 'Not implemented yet.'));
      }
    },
    getPrettyIntLabelInfo(annotation: AnnotationModel): string {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { user_id, value_int } = annotation;
      const user: UserModel | undefined = this.users[user_id];

      let ret = '';
      if (user) {
        ret += user.username;
      } else {
        ret += '??';
      }
      if (value_int !== undefined && value_int !== null && this.choiceLookup[value_int]) {
        ret += `: ${this.choiceLookup[value_int].name}`;
      }
      return ret;
    },
  },
  computed: {
    cmap(): string[] {
      const { choices } = this.info;
      return (!choices || choices.length > 10) ? cmap20 : cmap10;
    },
    choiceLookup(): Record<number, AnnotationSchemeLabelChoiceFlat> {
      const { choices } = this.info;
      if (!choices) return {};
      return Object.fromEntries(choices.map((choice: AnnotationSchemeLabelChoiceFlat) => [choice.value, choice]));
    },
    userAnnotationsSorted(): AnnotationModel[] {
      if (!this.userAnnotations) return [];
      return this.userAnnotations.toSorted(
        // eslint-disable-next-line no-nested-ternary
        (a1: AnnotationModel, a2: AnnotationModel) => ((a1.user_id < a2.user_id) ? -1 : (a1.user_id > a2.user_id) ? 1 : 0),
      );
    },
  },
});
</script>
