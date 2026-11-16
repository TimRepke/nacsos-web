<template>
  <tbody>
    <tr>
      <td class="text-muted small">
        {{ ordering.identifier }}
        <font-awesome-icon :icon="['fas', 'file-invoice']" @click="showItem = !showItem" />
      </td>
      <td>
        <div
          ref="itemCell"
          class="text-muted font-monospace fs-fn text-break me-2 d-inline-block"
          style="width: 20ch"
          role="button"
          tabindex="-1"
          @click="$emit('request-focus-item', ordering.item_id)"
        >
          {{ ordering.item_id }}
        </div>
      </td>
      <td
        v-for="label in labels"
        :key="label.path_key"
        class="text-end"
        :class="{
          'bg-warning': !isValid(label),
          'cell-changed': changedKeys.has(`${ordering.item_id}|${label.path_key}`),
        }"
      >
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

<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from "vue";
import type { PropType } from "vue";
import type { UserModel, ResolutionCell, FlatLabel, ResolutionOrdering } from "@/plugins/api/types";
import BoolLabel from "@/components/annotations/resolve/BoolLabel.vue";
import ChoiceLabel from "@/components/annotations/resolve/ChoiceLabel.vue";
import MultiLabel from "@/components/annotations/resolve/MultiLabel.vue";
import StringLabel from "@/components/annotations/resolve/StringLabel.vue";
import type { AnyItem } from "@/types/items";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { is, isNone, sanitizeHtml } from "@/util";

defineOptions({ name: "ResolverRow" });

defineEmits(["bot-annotation-changed", "request-focus-item"]);

const props = defineProps({
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
  changedKeys: {
    type: Object as PropType<Set<string>>,
    default: () => new Set<string>(),
  },
});

const item = ref<AnyItem | null>(null);
const showItem = ref(false);
const itemRequested = ref(false);
const itemObserver = ref<IntersectionObserver | null>(null);
const itemCell = ref<HTMLElement | null>(null);

onUnmounted(() => {
  itemObserver.value?.disconnect();
  itemObserver.value = null;
});

/**
 * Defer the item detail fetch until the row is actually (about to be) visible.
 * Without this, toggling "show text" fires one request per row and keeps every
 * full text in memory, even for rows nobody scrolled to.
 */
function scheduleItemFetch() {
  if (itemRequested.value) return;
  itemRequested.value = true;
  const target = itemCell.value as HTMLElement | undefined;
  if (!target || typeof IntersectionObserver === "undefined") {
    fetchItem();
    return;
  }
  itemObserver.value = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        itemObserver.value?.disconnect();
        itemObserver.value = null;
        fetchItem();
      }
    },
    { rootMargin: "400px" }, // start loading slightly before the row enters the viewport
  );
  itemObserver.value.observe(target);
}
function fetchItem() {
  API.project
    .getDetailForItemApiProjectItemsDetailItemIdGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      path: { item_id: props.ordering.item_id },
    })
    .then((response) => {
      item.value = response.data;
    })
    .catch(() => {
      // ignore
    });
}
function isValid(label: FlatLabel): boolean {
  /**
   * This function checks the validity of the resolved label for an item.
   * A label is invalid, if the parent label does not have this one as a child.
   */

  // entries w/o parents are always valid
  if (!label.parent_key) return true;
  // empty bot annotations are always valid (independent of parent label)
  // empty or whitespace-only text counts as empty
  const resolution = props.row[label.path_key]?.resolution;
  const valueStr = resolution?.value_str;
  const hasText = is<string>(valueStr) && valueStr.trim().length > 0;
  if (
    isNone(resolution) ||
    (isNone(resolution?.value_int) &&
      isNone(resolution?.value_bool) &&
      !hasText &&
      isNone(resolution?.value_float) &&
      isNone(resolution?.multi_int))
  )
    return true;

  // check if parent choice has this label as child
  // can't decide with incomplete information (this case should not occur anyway)
  const validParentInScheme: number | undefined | null = label.parent_value;
  if (isNone(validParentInScheme)) return true;

  // TODO: Should really be recursive checking here so that the entire row is invalid if one parent is invalid!
  const parentValueInt: number | undefined | null = props.row[label.parent_key].resolution?.value_int;
  const parentValueMultiInt: number[] | undefined | null = props.row[label.parent_key].resolution?.multi_int;

  return (
    parentValueInt === validParentInScheme ||
    (is<number[]>(parentValueMultiInt) && parentValueMultiInt.indexOf(validParentInScheme) >= 0)
  );
}

const itemHtmlText = computed<string>(() => {
  let ret = "";
  if (item.value) {
    if (item.value.title) {
      ret += `<strong>${item.value.title}</strong><br />`;
    }
    if (item.value.text) {
      ret += item.value.text.replaceAll("\n", "<br />");
    }
  }
  // item data is user-supplied, so the built html must be sanitized before v-html
  return sanitizeHtml(ret);
});
const hasItemText = computed<boolean>(() => item.value && item.value.text);

watch(
  () => props.showText,
  (newValue: boolean) => {
    showItem.value = newValue;
  },
);
watch(
  () => showItem.value,
  (newValue: boolean) => {
    if (newValue && !item.value) {
      scheduleItemFetch();
    }
  },
);
</script>

<style scoped>
/* cell whose resolved value differs from the last saved state */
td.cell-changed {
  background-color: rgba(13, 110, 253, 0.08);
  box-shadow: inset 0 0 0 2px rgba(13, 110, 253, 0.35);
}
</style>
