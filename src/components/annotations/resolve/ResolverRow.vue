<template>
  <tbody>
    <tr>
      <td class="text-muted small">
        {{ ordering.identifier }}
        <font-awesome-icon :icon="['fas', 'file-invoice']" @click="showItem = !showItem" />
      </td>
      <td>
        <div
          class="text-muted font-monospace fs-fn text-break me-2 d-inline-block"
          style="width: 20ch"
          role="button"
          tabindex="-1"
          @click="$emit('request-focus-item', ordering.item_id)"
        >
          {{ ordering.item_id }}
        </div>
      </td>
      <td v-for="label in labels" :key="label.path_key" class="text-end" :class="{ 'bg-warning': !isValid(label) }">
        <template v-if="label.kind === 'bool' && row[label.path_key]">
          <BoolLabel
            class="d-flex justify-content-end"
            :item-id="ordering.item_id"
            :proposal="row[label.path_key]"
            :proposal-row="row"
            :label="label"
            :users-lookup="userLookup"
            :users="users"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)"
          />
        </template>

        <template v-else-if="label.kind === 'single' && row[label.path_key]">
          <ChoiceLabel
            class="d-flex justify-content-end"
            :item-id="ordering.item_id"
            :proposal="row[label.path_key]"
            :proposal-row="row"
            :label="label"
            :users-lookup="userLookup"
            :users="users"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)"
          />
        </template>

        <template v-else-if="label.kind === 'multi' && row[label.path_key]">
          <MultiLabel
            class="d-flex justify-content-end"
            :item-id="ordering.item_id"
            :proposal="row[label.path_key]"
            :proposal-row="row"
            :label="label"
            :users-lookup="userLookup"
            :users="users"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)"
          />
        </template>

        <template v-else-if="label.kind === 'str' && row[label.path_key]">
          <StringLabel
            class="d-flex justify-content-end"
            :item-id="ordering.item_id"
            :proposal="row[label.path_key]"
            :proposal-row="row"
            :label="label"
            :users-lookup="userLookup"
            :users="users"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)"
          />
        </template>

        <template v-else> Unhandled "{{ label.kind }}" </template>
      </td>
    </tr>
    <tr v-if="hasItemText && showItem">
      <td colspan="1000">
        <div class="text-muted fs-fn p-1 rounded border border-secondary col-md-7" v-html="itemHtmlText" />
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { UserModel, ResolutionCell, FlatLabel, ResolutionOrdering } from "@/plugins/api/types";
import BoolLabel from "@/components/annotations/resolve/BoolLabel.vue";
import ChoiceLabel from "@/components/annotations/resolve/ChoiceLabel.vue";
import MultiLabel from "@/components/annotations/resolve/MultiLabel.vue";
import StringLabel from "@/components/annotations/resolve/StringLabel.vue";
import type { AnyItem } from "@/types/items";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { is, isNone } from "@/util";

export default defineComponent({
  name: "ResolverRow",
  components: { StringLabel, MultiLabel, BoolLabel, ChoiceLabel },
  emits: ["bot-annotation-changed", "request-focus-item"],
  props: {
    botAnnotationMetaDataId: { type: String, required: false, default: undefined },
    row: {
      type: Object as PropType<Record<string, ResolutionCell>>,
      required: true,
    },
    labelLookup: {
      type: Object as PropType<Record<string, FlatLabel>>,
      required: true,
    },
    ordering: {
      type: Object as PropType<ResolutionOrdering>,
      required: true,
    },
    labels: {
      type: Array as PropType<Array<FlatLabel>>,
      required: true,
    },
    userLookup: {
      type: Object as PropType<Record<string, UserModel>>,
      required: true,
    },
    users: {
      type: Array as PropType<Array<UserModel>>,
      required: true,
    },
    showText: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      item: null as AnyItem | null,
      showItem: false,
    };
  },
  methods: {
    isValid(label: FlatLabel): boolean {
      /**
       * This function checks the validity of the resolved label for an item.
       * A label is invalid, if the parent label does not have this one as a child.
       */

      // entries w/o parents are always valid
      if (!label.parent_key) return true;
      // empty bot annotations are always valid (independent of parent label)
      if (
        isNone(this.row[label.path_key]) ||
        isNone(this.row[label.path_key].resolution) ||
        (isNone(this.row[label.path_key].resolution?.value_int) &&
          isNone(this.row[label.path_key].resolution?.value_bool) &&
          isNone(this.row[label.path_key].resolution?.value_str) &&
          isNone(this.row[label.path_key].resolution?.value_float) &&
          isNone(this.row[label.path_key].resolution?.multi_int))
      )
        return true;

      // check if parent choice has this label as child
      // can't decide with incomplete information (this case should not occur anyway)
      const validParentInScheme: number | undefined | null = label.parent_value;
      if (isNone(validParentInScheme)) return true;

      // TODO: Should really be recursive checking here so that the entire row is invalid if one parent is invalid!
      const parentValueInt: number | undefined | null = this.row[label.parent_key].resolution?.value_int;
      const parentValueMultiInt: number[] | undefined | null = this.row[label.parent_key].resolution?.multi_int;

      return (
        parentValueInt === validParentInScheme ||
        (is<number[]>(parentValueMultiInt) && parentValueMultiInt.indexOf(validParentInScheme) >= 0)
      );
    },
  },
  computed: {
    itemHtmlText(): string {
      let ret = "";
      if (this.item) {
        if (this.item.title) {
          ret += `<strong>${this.item.title}</strong><br />`;
        }
        if (this.item.text) {
          ret += this.item.text.replaceAll("\n", "<br />");
        }
      }
      return ret;
    },
    hasItemText(): boolean {
      return this.item && this.item.text;
    },
  },
  watch: {
    showText(newValue: boolean) {
      this.showItem = newValue;
    },
    showItem(newValue: boolean) {
      if (newValue && !this.item) {
        API.project
          .getDetailForItemApiProjectItemsDetailItemIdGet({
            xProjectId: currentProjectStore.projectId as string,
            itemId: this.ordering.item_id,
          })
          .then((response) => {
            this.item = response.data;
          })
          .catch(() => {
            // ignore
          });
      }
    },
  },
});
</script>
