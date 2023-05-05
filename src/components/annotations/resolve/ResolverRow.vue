<template>
  <tbody>
    <tr>
      <td class="text-muted small">
        {{ rowIdx }}
        <font-awesome-icon :icon="['fas', 'file-invoice']" @click="showItem = !showItem" />
      </td>
      <td>
        <div
          class="text-muted font-monospace fs-fn text-break me-2 d-inline-block"
          style="width: 20ch;"
          role="button"
          tabindex="-1"
          @click="$emit('request-focus-item', itemId)">
          {{ itemId }}
        </div>
      </td>
      <td
        v-for="(labelInfo, strLabel) in labelLookup"
        :key="strLabel"
        class="text-end"
        :class="{ 'bg-warning': !isValid(labelInfo, itemId, strLabel) }">

        <template v-if="schemeLookup[labelInfo.path[0].key]?.kind === 'bool'">
          <BoolLabel
            class="d-flex justify-content-end"
            :user-annotations="row[strLabel].users"
            :bot-annotation="row[strLabel].bot"
            :info="schemeLookup[labelInfo.path[0].key]"
            :users="userLookup"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />
        </template>

        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'single'">
          <ChoiceLabel
            class="d-flex justify-content-end"
            :user-annotations="row[strLabel].users"
            :bot-annotation="row[strLabel].bot"
            :info="schemeLookup[labelInfo.path[0].key]"
            :users="userLookup"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />
        </template>

        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'multi'">
          <MultiLabel
            class="d-flex justify-content-end"
            :user-annotations="row[strLabel].users"
            :bot-annotation="row[strLabel].bot"
            :info="schemeLookup[labelInfo.path[0].key]"
            :users="selectedUserLookup"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />
        </template>

        <template v-else-if="schemeLookup[labelInfo.path[0].key]?.kind === 'str'">
          <StringLabel
            class="d-flex justify-content-end"
            :user-annotations="row[strLabel].users"
            :bot-annotation="row[strLabel].bot"
            :info="schemeLookup[labelInfo.path[0].key]"
            :users="userLookup"
            @bot-annotation-changed="$emit('bot-annotation-changed', $event)" />
        </template>

        <template v-else>
          Unhandled "{{ schemeLookup[labelInfo.path[0].key]?.kind }}"
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
import type {
  AnnotationModel,
  FlattenedAnnotationSchemeLabel,
  BotAnnotationModel,
  Label,
  UserModel,
} from '@/plugins/api/api-core';
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import BoolLabel from '@/components/annotations/resolve/BoolLabel.vue';
import ChoiceLabel from '@/components/annotations/resolve/ChoiceLabel.vue';
import MultiLabel from '@/components/annotations/resolve/MultiLabel.vue';
import StringLabel from '@/components/annotations/resolve/StringLabel.vue';
import type { AnyItem } from '@/types/items';
import { API } from '@/plugins/api';
import { currentProjectStore } from '@/stores';

type LookupMatrixRow = Record<string, { users: AnnotationModel[], bot: BotAnnotationModel | undefined }>;
type LabelLookupValue = {
  parentChoice?: number,
  parentKey?: string,
  path: Label[],
  strParent?: string,
};
export default defineComponent({
  name: 'ResolverRow',
  components: { StringLabel, MultiLabel, BoolLabel, ChoiceLabel },
  emits: ['bot-annotation-changed', 'request-focus-item'],
  props: {
    rowIdx: {
      type: Number,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    row: {
      type: Object as PropType<LookupMatrixRow>,
      required: true,
    },
    schemeLookup: {
      type: Object as PropType<Record<string, FlattenedAnnotationSchemeLabel>>,
      required: true,
    },
    labelLookup: {
      type: Object as PropType<Record<string, LabelLookupValue>>,
      required: true,
    },
    userLookup: {
      type: Object as PropType<Record<string, UserModel>>,
      required: true,
    },
    selectedUserLookup: {
      type: Object as PropType<Record<string, UserModel>>,
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
    isValid(labelInfo: LabelLookupValue, itemId: string, strPath: string): boolean {
      /**
       * This function checks the validity of the resolved label for an item.
       * A label is invalid, if the parent label does not have this one as a child.
       */

      // entries w/o parents are always valid
      if (labelInfo.strParent === undefined) return true;
      // empty bot annotations are always valid (independent of parent label)
      if (this.row[strPath] === undefined
        || this.row[strPath].bot === undefined
        || (this.row[strPath].bot?.value_int === undefined
          && this.row[strPath].bot?.value_bool === undefined
          && this.row[strPath].bot?.value_str === undefined
          && this.row[strPath].bot?.value_float === undefined
          && this.row[strPath].bot?.multi_int === undefined)) return true;
      // ignore if parent label not in this view
      // FIXME: verify that this is safe to assume (e.g. what if parent choice was never assigned rather
      //        than explicitly not selected in this configuration)
      if (!(labelInfo.strParent in this.labelLookup)) return true;

      // check if parent choice has this label as child
      const parentValueInt: number | undefined = this.row[labelInfo.strParent].bot?.value_int;
      const parentValueMultiInt: number[] | undefined = this.row[labelInfo.strParent].bot?.multi_int;
      const validParentInScheme: number = this.schemeLookup[labelInfo.path[0].key].parent_choice as number;

      return (parentValueInt === validParentInScheme)
        || (!!parentValueMultiInt && parentValueMultiInt.indexOf(validParentInScheme) >= 0);
    },
  },
  computed: {
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
