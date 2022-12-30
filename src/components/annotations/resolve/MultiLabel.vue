<template>
  <div v-if="botAnnotation !== undefined">

    <closable-pill v-for="tag in botAnnotation.multi_int" :key="tag" class="me-1" @clicked-x="removeLabel(tag)">
      {{ tag }}
    </closable-pill>

    <div class="dropdown ps-2 d-inline-block">
      <span
        class="border text-light p-1 border-dark border-2 rounded-3"
        role="button"
        tabindex="-1"
        @click="editMode = !editMode">
        <font-awesome-icon :icon="['fas', 'plus']" class="text-dark" />
      </span>
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
        <li v-for="choice in info.choices" :key="choice.value">
          <span class="dropdown-item" role="button" tabindex="-1" @click="addLabel(choice.value)">
            <strong>{{ choice.value }}:</strong> {{ choice.name }}
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">

import {
  AnnotationModel,
  AnnotationSchemeLabelChoiceFlat,
  BotAnnotationModel,
  FlattenedAnnotationSchemeLabel, UserModel,
} from '@/plugins/api/api-core';
import { PropType } from 'vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import ClosablePill from '@/components/ClosablePill.vue';

function hasValue(model: AnnotationModel | BotAnnotationModel | undefined | null):
  model is (AnnotationModel | BotAnnotationModel) & { multi_int: number } {
  if (model === null || model === undefined) return false;
  return (model.multi_int !== undefined && model.multi_int !== null);
}

interface MultiLabelData {
  changed: boolean,
  editMode: boolean,
}

export default {
  name: 'MultiLabel',
  components: { ClosablePill },
  data(): MultiLabelData {
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
      model is (AnnotationModel | BotAnnotationModel) & { multi_int: number } {
      return hasValue(model);
    },
    addLabel(value: number) {
      if (this.botAnnotation !== undefined) {
        if (this.botAnnotation.multi_int?.indexOf(value) < 0) {
          this.changed = true;
          const anno = this.botAnnotation;
          anno.multi_int.push(value);
          this.$emit('botAnnotationChanged', anno);
          this.editMode = false;
        }
      } else {
        // FIXME: not implemented (handle adding new BotAnnotation, i.e. handle the case where item has no annotation here)
        // const anno: BotAnnotationModel = {};
        EventBus.emit(new ToastEvent('WARN', 'Not implemented yet.'));
      }
    },
    removeLabel(value: number) {
      if (this.botAnnotation !== undefined) {
        const pos = this.botAnnotation.multi_int?.indexOf(value);
        if (pos >= 0) {
          this.changed = true;
          const anno = this.botAnnotation;
          anno.multi_int.splice(pos, 1);
          this.$emit('botAnnotationChanged', anno);
          this.editMode = false;
        }
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
    choiceLookup(): Record<number, AnnotationSchemeLabelChoiceFlat> {
      return Object.fromEntries(this.info.choices.map((choice: AnnotationSchemeLabelChoiceFlat) => [choice.value, choice]));
    },
  },
};
</script>

<style scoped>
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 1rem;
  --bs-badge-font-weight: bold;
}
</style>
