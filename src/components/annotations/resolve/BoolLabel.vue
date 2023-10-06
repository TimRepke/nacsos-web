<template>
  <div>
    <span v-for="user in users" :key="user.user_id">
      <span v-for="annotation in proposal.labels[user.user_id]" :key="annotation.annotation.annotation_id">
        <InlineToolTip :info="getPrettyUsername(user)" placement="bottom">
          <font-awesome-icon
            :icon="['fas', annotation2icon(annotation.annotation.value_bool)]"
            :class="[val2classes(annotation.annotation.value_bool)]"
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

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import "core-js/modules/es.array.to-sorted";
import type { BotAnnotationModel, FlatLabel, ResolutionCell, UserModel } from "@/plugins/api/api-core";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { is, isNone } from "@/util";

export default defineComponent({
  name: "BoolLabel",
  components: { InlineToolTip },
  data() {
    return {
      // set to true when bot annotation was manipulated
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
    annotation2icon(val: boolean | undefined | null): string {
      if (isNone(val)) return "question";
      return val ? "check" : "xmark";
    },
    val2classes(value: boolean | undefined | null) {
      if (isNone(value)) return ["bg-light", "text-dark"];
      return value ? ["bg-success", "text-light"] : ["bg-danger", "text-light"];
    },
    proposal2classes(proposal: ResolutionCell): string[] {
      let classes: string[] = [];
      if (proposal.status === "NEW") {
        classes = ["resolve-label-new"];
      } else if (proposal.status === "CHANGED") {
        classes = ["resolve-label-changed"];
      }
      return classes.concat(this.val2classes(proposal.resolution?.value_bool));
    },
    setBotAnnotation(value: boolean | undefined | null) {
      const { resolution } = this.proposal;
      if (is<BotAnnotationModel>(resolution)) {
        if (resolution.value_bool !== value) {
          resolution.value_bool = value;
          this.$emit("botAnnotationChanged", resolution);
        } else {
          const parentId = this.proposalRow[this.label.path_key].resolution?.bot_annotation_id;
          if (!parentId) {
            EventBus.emit(
              new ToastEvent("WARN", "This is not a valid selection. Please check the parent annotation first."),
            );
          }
          this.proposal.resolution = {
            bot_annotation_id: crypto.randomUUID(),
            bot_annotation_metadata_id: this.botAnnotationMetaDataId,
            item_id: this.itemId,
            parent: parentId,
            key: this.label.key,
            repeat: this.label.repeat,
            value_bool: value,
          } as BotAnnotationModel;
          this.$emit("botAnnotationChanged", this.proposal.resolution);
        }
        this.changed = true;
      }
      this.editMode = false;
    },
    getPrettyUsername(user: UserModel | undefined | null): string {
      if (!is<UserModel>(user)) return "??";
      return `${user.username} (${user.full_name})`;
    },
  },
});
</script>
