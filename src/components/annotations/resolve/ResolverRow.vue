<template>
  <tbody>
    <tr>
      <td class="text-muted small">
        {{ ordering.identifier }} ({{ ordering.scope_id.substring(0, 4) }})
        <font-awesome-icon :icon="['fas', 'file-invoice']" @click="showItem = !showItem" />
      </td>
      <td>
        <div
          class="text-muted font-monospace fs-fn text-break me-2 d-inline-block"
          style="width: 20ch;"
          role="button"
          tabindex="-1"
          @click="$emit('request-focus-item', ordering.item_id)">
          {{ ordering.item_id }}
        </div>
      </td>
      <td
        v-for="label in labels"
        :key="label.path_key"
        class="text-end"
        :class="{ 'bg-warning': !isValid(label) }">

        <template v-if="label.kind === 'bool'">
          <BoolLabel
            class="d-flex justify-content-end"
            :item-id="ordering.item_id"
            :proposal="row[label.path_key]"
            :proposal-row="row"
            :label="label"
            :users-lookup="userLookup"
            :users="users"
            :bot-annotation-meta-data-id="botAnnotationMetaDataId"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />
        </template>

        <!--        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'single'">-->
        <!--          <ChoiceLabel-->
        <!--            class="d-flex justify-content-end"-->
        <!--            :user-annotations="row[strLabel].users"-->
        <!--            :bot-annotation="row[strLabel].bot"-->
        <!--            :info="schemeLookup[labelInfo.path[0].key]"-->
        <!--            :users="userLookup"-->
        <!--            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />-->
        <!--        </template>-->

        <!--        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'multi'">-->
        <!--          <MultiLabel-->
        <!--            class="d-flex justify-content-end"-->
        <!--            :user-annotations="row[strLabel].users"-->
        <!--            :bot-annotation="row[strLabel].bot"-->
        <!--            :info="schemeLookup[labelInfo.path[0].key]"-->
        <!--            :users="selectedUserLookup"-->
        <!--            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />-->
        <!--        </template>-->

        <!--        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'str'">-->
        <!--          <StringLabel-->
        <!--            class="d-flex justify-content-end"-->
        <!--            :user-annotations="row[strLabel].users"-->
        <!--            :bot-annotation="row[strLabel].bot"-->
        <!--            :info="schemeLookup[labelInfo.path[0].key]"-->
        <!--            :users="userLookup"-->
        <!--            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />-->
        <!--        </template>-->

        <template v-else>
          Unhandled "{{ label.kind }}"
        </template>
      </td>
    </tr>
    <tr v-if="hasItemText && showItem">
      <td colspan="1000">
        <div
          class="text-muted fs-fn p-1 rounded border border-secondary col-md-7"
          v-html="itemHtmlText" />
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type {
  UserModel,
  ResolutionCell, FlatLabel, ResolutionOrdering,
} from '@/plugins/api/api-core';
import BoolLabel from '@/components/annotations/resolve/BoolLabel.vue';
import ChoiceLabel from '@/components/annotations/resolve/ChoiceLabel.vue';
import MultiLabel from '@/components/annotations/resolve/MultiLabel.vue';
import StringLabel from '@/components/annotations/resolve/StringLabel.vue';
import type { AnyItem } from '@/types/items';
import { API } from '@/plugins/api';
import { currentProjectStore } from '@/stores';
import { ImportConfigTwitter } from '@/plugins/api/api-core';
import sort_order = ImportConfigTwitter.sort_order;

export default defineComponent({
  name: 'ResolverRow',
  components: { StringLabel, MultiLabel, BoolLabel, ChoiceLabel },
  emits: ['bot-annotation-changed', 'request-focus-item'],
  props: {
    botAnnotationMetaDataId: { type: String, required: true },
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
      if (this.row[label.path_key] === undefined
        || this.row[label.path_key].resolution === undefined
        || this.row[label.path_key].resolution === null
        || (this.row[label.path_key].resolution?.value_int === undefined
          && this.row[label.path_key].resolution?.value_bool === undefined
          && this.row[label.path_key].resolution?.value_str === undefined
          && this.row[label.path_key].resolution?.value_float === undefined
          && this.row[label.path_key].resolution?.multi_int === undefined)) return true;

      // check if parent choice has this label as child
      const parentValueInt: number | undefined | null = this.row[label.path_key].resolution?.value_int;
      const parentValueMultiInt: number[] | undefined | null = this.row[label.path_key].resolution?.multi_int;
      const validParentInScheme: number | undefined | null = label.parent_value;
      // can't decide with incomplete information (this case should not occur anyway)
      if (validParentInScheme === undefined || validParentInScheme === null) return true;
      return (parentValueInt === validParentInScheme)
        || (!!parentValueMultiInt && parentValueMultiInt.indexOf(validParentInScheme) >= 0);
    },
  },
  computed: {
    sort_order() {
      return sort_order;
    }, ImportConfigTwitter() {
      return ImportConfigTwitter;
    },
    itemHtmlText(): string {
      let ret = '';
      if (this.item) {
        if (this.item.title) {
          ret += `<strong>${this.item.title}</strong><br />`;
        }
        if (this.item.text) {
          ret += this.item.text.replaceAll('\n', '<br />');
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
        API.core.project.getDetailForItemApiProjectItemsDetailItemIdGet({
          xProjectId: currentProjectStore.projectId as string,
          itemId: this.itemId,
        }).then((response) => {
          this.item = response.data;
        }).catch(() => {
          // ignore
        });
      }
    },
  },
});
</script>
