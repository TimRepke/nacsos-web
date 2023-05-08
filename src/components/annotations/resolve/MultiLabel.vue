<template>
  <div v-if="botAnnotation !== undefined">
    <div class="flex-wrap">
      <InlineToolTip
        v-for="tag in botAnnotation.multi_int.toSorted()"
        :key="tag"
        :info="choiceInfo[tag]">
        <closable-pill
          class="me-1 mb-1"
          :bg-override="true"
          :style="{
            'background-color': `${AgreementColour[choiceAgreements[tag]]}!important`,
            'font-weight': 'normal',
          }"
          @clicked-x="removeLabel(tag)">
          {{ tag }}
        </closable-pill>
      </InlineToolTip>
    </div>
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

import type {
  AnnotationModel,
  AnnotationSchemeLabelChoiceFlat,
  BotAnnotationModel,
  FlattenedAnnotationSchemeLabel,
  UserModel,
} from '@/plugins/api/api-core';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import ClosablePill from '@/components/ClosablePill.vue';
import InlineToolTip from '@/components/InlineToolTip.vue';

function hasValue(model: AnnotationModel | BotAnnotationModel | undefined | null):
  model is (AnnotationModel | BotAnnotationModel) & { multi_int: number } {
  if (model === null || model === undefined) return false;
  return (model.multi_int !== undefined && model.multi_int !== null);
}

interface MultiLabelData {
  changed: boolean,
  editMode: boolean,
  AgreementColour: Record<Agreement, string>,
}

enum Agreement {
  // All users from the pool picked this choice
  FULL = 'full',
  // Some, but not all annotators from the pool picked this choice
  PARTIAL = 'partial',
  // One user from the pool picked this choice (note, not in case only one user was in the pool)
  SINGLE = 'single',
  // This choice was added during consolidation
  NOVEL = 'novel',
}

export default defineComponent({
  name: 'MultiLabel',
  components: { ClosablePill, InlineToolTip },
  data(): MultiLabelData {
    return {
      changed: false,
      editMode: false,
      AgreementColour: {
        full: 'green',
        partial: '#BB8E49',
        single: 'orange',
        novel: 'limegreen',
      } as Record<Agreement, string>,
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
      const anno = this.botAnnotation;
      if (anno !== undefined) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { multi_int } = anno;
        if (multi_int !== undefined) {
          const pos: number = multi_int.indexOf(value);
          if (pos < 0) {
            this.changed = true;
            multi_int.push(value);
            this.$emit('botAnnotationChanged', anno);
            this.editMode = false;
          }
        }
      } else {
        // FIXME: not implemented (handle adding new BotAnnotation, i.e. handle the case where item has no annotation here)
        // const anno: BotAnnotationModel = {};
        EventBus.emit(new ToastEvent('WARN', 'Not implemented yet.'));
      }
    },
    removeLabel(value: number) {
      const anno = this.botAnnotation;
      if (anno !== undefined) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { multi_int } = anno;
        if (multi_int !== undefined) {
          const pos: number = multi_int.indexOf(value);
          if (pos >= 0) {
            this.changed = true;
            multi_int.splice(pos, 1);
            this.$emit('botAnnotationChanged', anno);
            this.editMode = false;
          }
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
      if (this.info && this.info.choices) {
        return Object.fromEntries(this.info.choices.map((choice: AnnotationSchemeLabelChoiceFlat) => [choice.value, choice]));
      }
      return {};
    },
    choiceUsers(): Record<number, UserModel[]> {
      const annos = this.userAnnotations;
      if (!annos || !this.users) return {};
      const entries = annos
        .flatMap((anno: AnnotationModel) => {
          if (!anno.multi_int) return undefined;
          return anno.multi_int.map((mi): [UserModel, number] => [this.users[anno.user_id] as UserModel, mi as number]);
        })
        .filter((entry: [UserModel, number] | undefined) => entry !== undefined) as [UserModel, number][];

      return entries.reduce((accu: Record<number, UserModel[]>, entry: [UserModel, number]) => {
        const [user, choice] = entry;
        // eslint-disable-next-line no-param-reassign
        if (!accu[choice]) accu[choice] = [];
        accu[choice].push(user);
        return accu;
      }, {});
    },
    choiceInfo(): Record<number, string> {
      const userEntries = Object.entries(this.choiceUsers) as unknown as Array<[number, UserModel[]]>;
      return Object.fromEntries(
        userEntries.map((entry: [number, UserModel[]]) => {
          const [choice, entryUsers] = entry;
          const usernames = entryUsers.map((user) => user.username).join(', ');
          const choiceName = this.choiceLookup[choice].name;
          return [choice, `${usernames}: "${choiceName}"`];
        }),
      );
    },
    choiceAgreements(): Record<number, Agreement> {
      const numUsers: number = Object.keys(this.users).length;
      const multiInt = this.botAnnotation?.multi_int;
      const annos = this.userAnnotations;
      if (!annos || !multiInt) return {};
      const userEntries = Object.entries(this.choiceUsers) as unknown as Array<[number, UserModel[]]>;
      const counters: Record<number, number> = Object.fromEntries(
        userEntries.map((entry: [number, UserModel[]]) => [entry[0], entry[1].length]),
      );

      if (!counters) return {};

      return Object.fromEntries(
        multiInt.map((choice: number) => {
          const count = counters[choice];
          if (!count) return [choice, Agreement.NOVEL]; // undefined, 0, null
          if (numUsers === 1) return [choice, Agreement.FULL];
          if (count === numUsers) return [choice, Agreement.FULL];
          if (count === 1) return [choice, Agreement.SINGLE];
          return [choice, Agreement.PARTIAL];
        }),
      );
    },
  },
});
</script>

<style scoped>
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 1rem;
  --bs-badge-font-weight: bold;
}
</style>
