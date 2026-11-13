<template>
  <div>
    <span v-for="user in users" :key="user.user_id">
      <span v-for="(annotation, idx) in proposal.labels[user.user_id as string] ?? []" :key="`${user.user_id}-${idx}`">
        <InlineToolTip :info="getPrettyLabelInfo(annotation)" placement="bottom">
          <font-awesome-icon
            :icon="['fas', annotation2icon(annotation.annotation?.value_bool)]"
            :class="[val2classes(annotation.annotation?.value_bool)]"
            class="border text-light p-1"
            style="height: 1rem; width: 1rem"
          />
        </InlineToolTip>
      </span>
    </span>

    <div class="dropdown ps-2 d-inline-block">
      <font-awesome-icon
        :icon="['fas', annotation2icon(proposal.resolution?.value_bool)]"
        :class="proposal2classes(proposal)"
        class="border border-dark border-2 rounded-3 text-light p-1 dropdown-toggle"
        role="button"
        style="height: 1rem; width: 1rem"
        @click="editMode = !editMode"
      />
      <ul class="dropdown-menu end-0" :class="{ show: editMode }">
        <li><span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(true)">True</span></li>
        <li><span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(false)">False</span></li>
        <li>
          <span class="dropdown-item" role="button" tabindex="-1" @click="setBotAnnotation(undefined)">[NONE]</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { PropType } from "vue";
import type {
  BotAnnotationModel,
  FlatLabel,
  ResolutionCell,
  ResolutionUserEntry,
  UserModel,
} from "@/plugins/api/types";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { is, isNone } from "@/util";

defineOptions({ name: "BoolLabel" });

const emit = defineEmits(["botAnnotationChanged"]);

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

// set to true when bot annotation was manipulated
const changed = ref(false);
const editMode = ref(false);

function annotation2icon(val: boolean | undefined | null): string {
  if (isNone(val)) return "question";
  return val ? "check" : "xmark";
}
function val2classes(value: boolean | undefined | null) {
  if (isNone(value)) return ["bg-light", "text-dark"];
  return value ? ["bg-success", "text-light"] : ["bg-danger", "text-light"];
}
function proposal2classes(proposal: ResolutionCell): string[] {
  let classes: string[] = [];
  if (proposal.status === "NEW") {
    classes = ["resolve-label-new"];
  } else if (proposal.status === "CHANGED") {
    classes = ["resolve-label-changed"];
  }
  return classes.concat(val2classes(proposal.resolution?.value_bool));
}
function setBotAnnotation(value: boolean | undefined | null) {
  const { resolution } = props.proposal;
  if (is<BotAnnotationModel>(resolution)) {
    resolution.value_bool = value;
    emit("botAnnotationChanged", resolution);

    changed.value = true;
  }
  editMode.value = false;
}
function getPrettyLabelInfo(userEntry: ResolutionUserEntry): string {
  // entries without annotation exist (the resolver fetches with include_empty: true)
  if (isNone(userEntry.annotation)) {
    return "No data";
  }
  const username = props.usersLookup[userEntry.annotation.user_id]?.username ?? "??";
  const valueBool = userEntry.annotation.value_bool;
  let value = "undetermined";
  if (valueBool === true) value = "true";
  else if (valueBool === false) value = "false";
  return `${username}: ${value}`;
}
</script>
