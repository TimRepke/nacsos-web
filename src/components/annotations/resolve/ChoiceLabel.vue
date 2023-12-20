<template>
  <div>
    <!-- User Annotations -->
    <span v-for="user in users" :key="user.user_id as string">
      <span
        v-for="annotation in proposal.labels[user.user_id as string]"
        :key="annotation.annotation!.annotation_id as string"
      >
        <InlineToolTip :info="getPrettyIntLabelInfo(annotation)" placement="bottom">
          <span
            class="border text-light p-1 ps-2 pe-2"
            :style="{ backgroundColor: annotation2bgColor(annotation.annotation) }"
            :class="{
              'resolve-label-new': annotation.status === 'NEW',
              'resolve-label-changed': annotation.status === 'CHANGED',
            }"
          >
            <template v-if="isNone(annotation.annotation?.value_int)">
              <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
            </template>
            <template v-else>
              {{ annotation.annotation?.value_int }}
            </template>
          </span>
        </InlineToolTip>
      </span>
    </span>
    <!-- / User Annotations -->

    <!-- BotAnnotation -->
    <div class="dropdown ps-2 d-inline-block">
      <span
        class="border text-light p-1 border-dark border-2 rounded-3 dropdown-toggle"
        :style="{ backgroundColor: annotation2bgColor(proposal.resolution) }"
        :class="{
          'resolve-label-new': proposal.status === 'NEW',
          'resolve-label-changed': proposal.status === 'CHANGED',
        }"
        role="button"
        tabindex="-1"
        @click="editMode = !editMode"
      >
        <template v-if="!hasValue(proposal.resolution)">
          <font-awesome-icon :icon="['fas', 'question']" class="text-dark" />
        </template>
        <template v-else>
          {{ proposal.resolution.value_int }}
        </template>
      </span>
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
        <li v-for="choice in label.choices" :key="choice.value">
          <span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(choice.value)">
            {{ choice.name }} ({{ choice.value }})
          </span>
        </li>
        <li>
          <span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(undefined)">[NONE]</span>
        </li>
      </ul>
    </div>
    <!-- / BotAnnotation -->
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import "core-js/modules/es.array.to-sorted";
import type {
  AnnotationModel,
  BotAnnotationModel,
  FlatLabel,
  ResolutionCell,
  ResolutionUserEntry,
  UserModel,
  FlatLabelChoice,
} from "@/plugins/api/api-core";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { cmap } from "@/types/colours";
import { is, isNone } from "@/util";

function hasValue(
  model: AnnotationModel | BotAnnotationModel | undefined | null,
): model is (AnnotationModel | BotAnnotationModel) & { value_int: number } {
  if (isNone(model)) return false;
  return model.value_int !== undefined && model.value_int !== null;
}

interface ChoiceLabelData {
  changed: boolean;
  editMode: boolean;
}

export default defineComponent({
  name: "ChoiceLabel",
  components: { InlineToolTip },
  data(): ChoiceLabelData {
    return {
      changed: false,
      editMode: false,
    };
  },
  emits: ["botAnnotationChanged"],
  props: {
    botAnnotationMetaDataId: { type: String, required: false, default: undefined },
    itemId: { type: String, required: true },
    label: {
      type: Object as PropType<FlatLabel>,
      required: true,
    },
    usersLookup: {
      type: Object as PropType<Record<string, UserModel>>,
      required: true,
    },
    users: {
      type: Array as PropType<Array<UserModel>>,
      required: true,
    },
    proposal: {
      type: Object as PropType<ResolutionCell>,
      required: true,
    },
    proposalRow: {
      type: Object as PropType<Record<string, ResolutionCell>>,
      required: true,
    },
  },
  methods: {
    isNone,
    hasValue(
      model: AnnotationModel | BotAnnotationModel | undefined | null,
    ): model is (AnnotationModel | BotAnnotationModel) & { value_int: number } {
      return hasValue(model);
    },
    annotation2bgColor(val: AnnotationModel | BotAnnotationModel | undefined | null) {
      if (hasValue(val)) {
        return cmap[val.value_int % cmap.length];
      }
      return "transparent";
    },
    setBotAnnotation(value: number | undefined | null) {
      const { resolution } = this.proposal;
      if (is<BotAnnotationModel>(resolution)) {
        resolution.value_int = value;
        this.$emit("botAnnotationChanged", resolution);
        this.changed = true;
      }
      this.editMode = false;
    },
    getPrettyIntLabelInfo(userEntry: ResolutionUserEntry): string {
      let username: string | null | undefined = "";
      let valueInt: number | null | undefined = null;
      if (!userEntry.annotation) {
        if (!userEntry.assignment) {
          return "No data";
        }
        username = userEntry.assignment.user_id;
      } else {
        username = this.usersLookup[userEntry.annotation.user_id]?.username;
        valueInt = userEntry.annotation.value_int;
      }
      let ret = "";
      if (username) {
        ret += username;
      } else {
        ret += "??";
      }
      if (is<number>(valueInt) && is<FlatLabelChoice>(this.choiceLookup[valueInt])) {
        ret += `: ${this.choiceLookup[valueInt].name}`;
      }
      return ret;
    },
  },
  computed: {
    choiceLookup(): Record<number, FlatLabelChoice> {
      const { choices } = this.label;
      if (!choices) return {};
      return Object.fromEntries(choices.map((choice: FlatLabelChoice) => [choice.value, choice]));
    },
  },
});
</script>

<style scoped></style>
