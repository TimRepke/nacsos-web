<template>
  <div v-if="showItemModal">
    <div
      class="modal fade show"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      style="display: block"
      @click="dismissModal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-scrollable" @click.stop="stop" role="button" tabindex="-1">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Details for item {{ itemId }}</h1>
            <button type="button" class="btn-close" aria-label="Close" @click="dismissModal" />
          </div>
          <div class="modal-body">
            <template v-if="isLoading">
              <p class="card-text placeholder-glow">
                <span class="placeholder col-7" />
                <span class="placeholder col-4" />
                <span class="placeholder col-4" />
                <span class="placeholder col-6" />
                <span class="placeholder col-8" />
              </p>
            </template>
            <template v-else>
              <AnyItemComponent :item="itemInfo" />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { AnyItem } from "@/types/items";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import AnyItemComponent from "@/components/items/AnyItem.vue";

const props = defineProps(["itemId"]);
const emit = defineEmits(["dismissed"]);

const itemInfo = ref<AnyItem | undefined>(undefined);
const requestPromise = ref<Promise<AnyItem> | undefined>(undefined);

// latent quirk carried over from the Options API version: the template binds `stop`
// as a click handler, but no component member `stop` ever existed and it resolved
// to undefined at runtime; keep that exact (undefined) value.
const stop: (() => void) | undefined = undefined;

// show modal if data is present or request is running
const showItemModal = computed(() => itemInfo.value !== undefined || requestPromise.value !== undefined);
const isLoading = computed(() => requestPromise.value !== undefined);

function getItemInfo(itemId: string) {
  itemInfo.value = null;
  requestPromise.value = API.project
    .getDetailForItemApiProjectItemsDetailItemIdGet({
      path: { item_id: itemId },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((result) => {
      itemInfo.value = result.data;
      requestPromise.value = undefined;
    })
    .catch(() => {
      dismissModal();
    });
}
function dismissModal() {
  resetRequest();
  itemInfo.value = undefined;
  emit("dismissed");
}
function resetRequest() {
  if (requestPromise.value !== undefined) {
    // the request promise is cancelable at runtime (fetch-client request), but the
    // chained promise type does not expose `cancel`; latent quirk from the original
    (requestPromise.value as Promise<AnyItem> & { cancel: () => void }).cancel();
    requestPromise.value = undefined;
  }
}

watch(
  () => props.itemId,
  (newId: string | null | undefined) => {
    // reset any prior request (if present)
    resetRequest();
    // fetch the data
    if (newId !== null && newId !== undefined) {
      getItemInfo(newId);
    }
  },
);
</script>
