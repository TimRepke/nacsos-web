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
      <div class="modal-dialog modal-xl modal-dialog-scrollable" @click.stop="stop">
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
          <!--          <div class="modal-footer">-->
          <!--            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
          <!--            <button type="button" class="btn btn-primary">Understood</button>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { AnyItem } from "@/types/items";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { CancelablePromise } from "@/plugins/api/core/CancelablePromise";
import AnyItemComponent from "@/components/items/AnyItem.vue";

type ItemModalData = {
  itemInfo: AnyItem | undefined;
  requestPromise: CancelablePromise<AnyItem> | undefined;
};

export default defineComponent({
  components: { AnyItemComponent },
  props: ["itemId"],
  emits: ["dismissed"],
  data(): ItemModalData {
    return {
      itemInfo: undefined,
      requestPromise: undefined,
    };
  },
  computed: {
    showItemModal() {
      // show modal if data is present or request is running
      return this.itemInfo !== undefined || this.requestPromise !== undefined;
    },
    isLoading() {
      return this.requestPromise !== undefined;
    },
  },
  methods: {
    getItemInfo(itemId: string) {
      this.itemInfo = null;
      this.requestPromise = API.core.project
        .getDetailForItemApiProjectItemsDetailItemIdGet({
          itemId,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((result) => {
          this.itemInfo = result.data;
          this.requestPromise = undefined;
        })
        .catch(() => {
          this.dismissModal();
        });
    },
    dismissModal() {
      this.resetRequest();
      this.itemInfo = undefined;
      this.$emit("dismissed");
    },
    resetRequest() {
      if (this.requestPromise !== undefined) {
        this.requestPromise.cancel();
        this.requestPromise = undefined;
      }
    },
  },
  watch: {
    itemId(newId: string | null | undefined) {
      // reset any prior request (if present)
      this.resetRequest();
      // fetch the data
      if (newId !== null && newId !== undefined) {
        this.getItemInfo(newId);
      }
    },
  },
});
</script>
