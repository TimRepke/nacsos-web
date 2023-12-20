<template>
  <div>
    <div class="flex-wrap">
      <InlineToolTip v-for="tag in tags" :key="tag" :info="choiceInfo[tag]">
        <closable-pill
          class="me-1 mb-1"
          :bg-override="true"
          :style="{
            'background-color': `${AgreementColour[choiceAgreements[tag]]}!important`,
            'font-weight': 'normal',
          }"
          @clicked-x="removeLabel(tag)"
        >
          {{ tag }}
        </closable-pill>
      </InlineToolTip>
    </div>
    <div class="d-flex flex-wrap" style="height: 1em">
      <span
        v-for="tag in discardedChoices"
        :key="tag"
        class="badge rounded-pill text-bg-light border border-1 border-secondary"
        style="font-weight: normal; font-size: 0.6em"
        >{{ tag }}</span
      >
    </div>
    <div class="dropdown ps-2 d-inline-block">
      <span
        class="border text-light p-1 border-dark border-2 rounded-3"
        role="button"
        tabindex="-1"
        @click="editMode = !editMode"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="text-dark" />
      </span>
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
        <li v-for="choice in label.choices" :key="choice.value">
          <span class="dropdown-item" role="button" tabindex="-1" @click="addLabel(choice.value)">
            <strong>{{ choice.value }}:</strong> {{ choice.name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import "core-js/modules/es.array.to-sorted";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type {
  AnnotationModel,
  BotAnnotationModel,
  UserModel,
  FlatLabel,
  ResolutionCell,
  ResolutionUserEntry,
  FlatLabelChoice,
} from "@/plugins/api/api-core";
import ClosablePill from "@/components/ClosablePill.vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { is, isNone, notNone } from "@/util";

function hasValue(
  model: AnnotationModel | BotAnnotationModel | undefined | null,
): model is (AnnotationModel | BotAnnotationModel) & { multi_int: number } {
  if (isNone(model)) return false;
  return model.multi_int !== undefined && model.multi_int !== null;
}

enum Agreement {
  // All users from the pool picked this choice
  FULL = "full",
  // Some, but not all annotators from the pool picked this choice
  PARTIAL = "partial",
  // One user from the pool picked this choice (note, not in case only one user was in the pool)
  SINGLE = "single",
  // This choice was added during consolidation
  NOVEL = "novel",
}

export default defineComponent({
  name: "MultiLabel",
  components: { ClosablePill, InlineToolTip },
  data() {
    return {
      changed: false,
      editMode: false,
      AgreementColour: {
        full: "green",
        partial: "#BB8E49",
        single: "orange",
        novel: "limegreen",
      } as Record<Agreement, string>,
    };
  },
  emits: ["botAnnotationChanged", "botAnnotationConfirmed"],
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
    hasValue(
      model: AnnotationModel | BotAnnotationModel | undefined | null,
    ): model is (AnnotationModel | BotAnnotationModel) & { multi_int: number } {
      return hasValue(model);
    },
    addLabel(value: number) {
      const anno = this.proposal.resolution;
      if (is<BotAnnotationModel>(anno)) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { multi_int } = anno;
        if (is<number[]>(multi_int)) {
          const pos: number = multi_int.indexOf(value);
          if (pos < 0) {
            this.changed = true;
            multi_int.push(value);
            this.$emit("botAnnotationChanged", anno);
          }
        } else {
          this.changed = true;
          anno.multi_int = [value];
          this.$emit("botAnnotationChanged", anno);
        }
      }
      this.editMode = false;
    },
    removeLabel(value: number) {
      const anno = this.proposal.resolution;
      if (is<BotAnnotationModel>(anno)) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { multi_int } = anno;
        if (is<number[]>(multi_int)) {
          const pos: number = multi_int.indexOf(value);
          if (pos >= 0) {
            this.changed = true;
            multi_int.splice(pos, 1);
            this.$emit("botAnnotationChanged", anno);
          }
        }
      }
      this.editMode = false;
    },
    getPrettyUsername(userId: string): string {
      const user: UserModel | undefined = this.usersLookup[userId];
      if (isNone(user)) return "??";
      return `${user.username} (${user.full_name})`;
    },
  },
  computed: {
    tags(): Array<number> {
      const { resolution } = this.proposalRow[this.label.path_key];
      if (is<BotAnnotationModel>(resolution) && is<Array<number>>(resolution.multi_int)) {
        return resolution.multi_int.toSorted();
      }
      return [];
    },
    choiceLookup(): Record<number, FlatLabelChoice> {
      const { choices } = this.label;
      if (!choices) return {};
      return Object.fromEntries(choices.map((choice: FlatLabelChoice) => [choice.value, choice]));
    },
    choiceUsers(): Record<number, UserModel[]> {
      const { labels } = this.proposalRow[this.label.path_key];
      if (isNone(labels)) {
        return {};
      }
      const entries = Object.entries<ResolutionUserEntry[]>(labels)
        .flatMap((userEntry: [string, ResolutionUserEntry[]]) => {
          const [userId, userLabels] = userEntry;
          return userLabels.flatMap((entry: ResolutionUserEntry) => {
            if (
              isNone(entry.annotation) ||
              isNone(entry.annotation.multi_int) ||
              entry.annotation.multi_int.length === 0
            )
              return undefined;
            return entry.annotation.multi_int.map((choice: number): [number, UserModel] => [
              choice as number,
              this.usersLookup[userId] as UserModel,
            ]);
          });
        })
        .filter((entry: [number, UserModel] | undefined) => notNone(entry)) as [number, UserModel][];

      return entries.reduce((accu: Record<number, UserModel[]>, entry: [number, UserModel]) => {
        const [choice, user] = entry;

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
          const usernames = entryUsers
            .filter((user) => !!user)
            .map((user) => user.username)
            .join(", ");
          const choiceName = this.choiceLookup[choice].name;
          return [choice, `${usernames}: "${choiceName}"`];
        }),
      );
    },
    choiceAgreements(): Record<number, Agreement> {
      const numUsers: number = Object.keys(this.users).length;
      const { resolution } = this.proposalRow[this.label.path_key];

      if (isNone(resolution) || isNone(resolution.multi_int)) return {};
      return Object.fromEntries(
        Object.entries<UserModel[]>(this.choiceUsers).map((entry: [string, UserModel[]]): [number, Agreement] => {
          const [choice_str, users] = entry;
          const choice = parseInt(choice_str);
          const usernames = users.filter((user) => !!user).map((user) => user.username);
          const count = new Set(usernames).size;
          if (!count) return [choice, Agreement.NOVEL]; // undefined, 0, null
          if (numUsers === 1) return [choice, Agreement.FULL];
          if (count === numUsers) return [choice, Agreement.FULL];
          if (count === 1) return [choice, Agreement.SINGLE];
          return [choice, Agreement.PARTIAL];
        }),
      );
    },
    discardedChoices(): Array<number> {
      const { resolution } = this.proposalRow[this.label.path_key];

      const chosen = Object.keys(this.choiceUsers).map((value) => parseInt(value));
      const resolved = isNone(resolution) || isNone(resolution.multi_int) ? [] : resolution.multi_int;

      return chosen.filter((value) => resolved.indexOf(value) < 0);
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
