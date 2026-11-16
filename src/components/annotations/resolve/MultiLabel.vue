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

<script lang="ts" setup>
import "core-js/modules/es.array.to-sorted";
import { computed, ref } from "vue";
import type { PropType } from "vue";
import type {
  BotAnnotationModel,
  UserModel,
  FlatLabel,
  ResolutionCell,
  ResolutionUserEntry,
  FlatLabelChoice,
} from "@/plugins/api/types";
import ClosablePill from "@/components/ClosablePill.vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { is, isNone, notNone } from "@/util";

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

defineOptions({ name: "MultiLabel" });

const emit = defineEmits(["botAnnotationChanged", "botAnnotationConfirmed"]);

const props = defineProps({
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
});

const changed = ref(false);
const editMode = ref(false);
const AgreementColour = ref({
  full: "green",
  partial: "#BB8E49",
  single: "orange",
  novel: "limegreen",
} as Record<Agreement, string>);

function addLabel(value: number) {
  const anno = props.proposal.resolution;
  if (is<BotAnnotationModel>(anno)) {
    const { multi_int } = anno;
    if (is<number[]>(multi_int)) {
      const pos: number = multi_int.indexOf(value);
      if (pos < 0) {
        changed.value = true;
        multi_int.push(value);
        emit("botAnnotationChanged", anno);
      }
    } else {
      changed.value = true;
      anno.multi_int = [value];
      emit("botAnnotationChanged", anno);
    }
  }
  editMode.value = false;
}
function removeLabel(value: number) {
  const anno = props.proposal.resolution;
  if (is<BotAnnotationModel>(anno)) {
    const { multi_int } = anno;
    if (is<number[]>(multi_int)) {
      const pos: number = multi_int.indexOf(value);
      if (pos >= 0) {
        changed.value = true;
        multi_int.splice(pos, 1);
        emit("botAnnotationChanged", anno);
      }
    }
  }
  editMode.value = false;
}

const tags = computed<Array<number>>(() => {
  const { resolution } = props.proposalRow[props.label.path_key];
  if (is<BotAnnotationModel>(resolution) && is<Array<number>>(resolution.multi_int)) {
    return resolution.multi_int.toSorted();
  }
  return [];
});
const choiceLookup = computed<Record<number, FlatLabelChoice>>(() => {
  const { choices } = props.label;
  if (!choices) return {};
  return Object.fromEntries(choices.map((choice: FlatLabelChoice) => [choice.value, choice]));
});
const choiceUsers = computed<Record<number, UserModel[]>>(() => {
  const { labels } = props.proposalRow[props.label.path_key];
  if (isNone(labels)) {
    return {};
  }
  const entries = Object.entries<ResolutionUserEntry[]>(labels)
    .flatMap((userEntry: [string, ResolutionUserEntry[]]) => {
      const [userId, userLabels] = userEntry;
      return userLabels.flatMap((entry: ResolutionUserEntry) => {
        if (isNone(entry.annotation) || isNone(entry.annotation.multi_int) || entry.annotation.multi_int.length === 0)
          return undefined;
        return entry.annotation.multi_int.map((choice: number): [number, UserModel] => [
          choice as number,
          props.usersLookup[userId] as UserModel,
        ]);
      });
    })
    .filter((entry: [number, UserModel] | undefined) => notNone(entry)) as [number, UserModel][];

  return entries.reduce((accu: Record<number, UserModel[]>, entry: [number, UserModel]) => {
    const [choice, user] = entry;

    if (!accu[choice]) accu[choice] = [];
    accu[choice].push(user);
    return accu;
  }, {});
});
const choiceInfo = computed<Record<number, string>>(() => {
  return Object.fromEntries(
    tags.value.map((choice: number): [number, string] => {
      const choiceName = choiceLookup.value[choice]?.name ?? String(choice);
      const entryUsers = choiceUsers.value[choice] ?? [];
      const usernames = entryUsers
        .filter((user) => !!user)
        .map((user) => user.username)
        .join(", ");
      if (!usernames) return [choice, `"${choiceName}" added during resolution`];
      return [choice, `${usernames}: "${choiceName}"`];
    }),
  );
});
const choiceAgreements = computed<Record<number, Agreement>>(() => {
  const numUsers: number = Object.keys(props.users).length;
  const { resolution } = props.proposalRow[props.label.path_key];

  if (isNone(resolution) || isNone(resolution.multi_int)) return {};
  return Object.fromEntries(
    tags.value.map((choice: number): [number, Agreement] => {
      // Choices added during consolidation are absent from choiceUsers; an empty
      // user list below marks them as NOVEL.
      const users = choiceUsers.value[choice] ?? [];
      const usernames = users.filter((user) => !!user).map((user) => user.username);
      const count = new Set(usernames).size;
      if (!count) return [choice, Agreement.NOVEL]; // undefined, 0, null
      if (numUsers === 1) return [choice, Agreement.FULL];
      if (count === numUsers) return [choice, Agreement.FULL];
      if (count === 1) return [choice, Agreement.SINGLE];
      return [choice, Agreement.PARTIAL];
    }),
  );
});
const discardedChoices = computed<Array<number>>(() => {
  const { resolution } = props.proposalRow[props.label.path_key];

  const chosen = Object.keys(choiceUsers.value).map((value) => parseInt(value));
  const resolved = isNone(resolution) || isNone(resolution.multi_int) ? [] : resolution.multi_int;

  return chosen.filter((value) => resolved.indexOf(value) < 0);
});
</script>

<style scoped>
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 1rem;
  --bs-badge-font-weight: bold;
}
</style>
