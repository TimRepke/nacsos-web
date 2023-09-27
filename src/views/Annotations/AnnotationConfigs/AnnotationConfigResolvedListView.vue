<template>
  <div>
    <h1>Resolve and Export Annotations</h1>
    <ul>
      <li v-for="meta in exports" :key="meta.b">
        {{ meta.name }}
        <router-link
          :to="{
            name: 'config-annotation-resolve',
            params: { bot_annotation_metadata_id: meta.bot_annotation_metadata_id },
          }"
          class="link-secondary me-1"
        >
          <InlineToolTip info="View & Resolve Annotations">
            <font-awesome-icon :icon="['fas', 'pen']" />
          </InlineToolTip>
        </router-link>
        <a
          @click="clone(meta.bot_annotation_metadata_id)"
          tabindex="0"
          aria-label="Copy scheme"
          class="link-secondary me-1"
          role="button"
        >
          <InlineToolTip info="Copy">
            <font-awesome-icon :icon="['far', 'clone']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          tabindex="0"
          aria-label="Delete resolved annotations"
          @click="remove(meta)"
        >
          <InlineToolTip info="Delete">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          tabindex="0"
          aria-label="Download annotations"
          @click="download(meta.bot_annotation_metadata_id)"
        >
          <InlineToolTip info="Export data">
            <font-awesome-icon :icon="['fas', 'file-export']" />
          </InlineToolTip>
        </a>
      </li>
    </ul>
    <router-link role="button" class="btn btn-outline-primary m-2 btn-sm" :to="{ name: 'config-annotation-resolve' }">
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create new export
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import type { ApiResponseReject } from "@/plugins/api";
import type { BotAnnotationMetaDataBaseModel } from "@/plugins/api/api-core";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { API } from "@/plugins/api";

type DataModel = {
  exports: BotAnnotationMetaDataBaseModel[];
};

export default defineComponent({
  name: "AnnotationConfigResolvedListView",
  components: { InlineToolTip },
  data(): DataModel {
    return {
      exports: [] as BotAnnotationMetaDataBaseModel[],
    } as DataModel;
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData() {
      API.core.annotations
        .listSavedResolvedAnnotationsApiAnnotationsConfigResolvedListGet({
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          const { data } = response;
          this.exports = data;
        })
        .catch((reason) => {
          console.error(reason);
          const err = reason as ApiResponseReject;
          EventBus.emit(new ToastEvent("ERROR", `Failed to load data (${err.error.type}: ${err.error.message})`));
        });
    },
    clone(bot_annotation_metadata_id: string) {
      // TODO
      EventBus.emit(new ToastEvent("INFO", `Not implemented yet, can't clone ${bot_annotation_metadata_id}.`));
    },
    download(bot_annotation_metadata_id: string) {
      // TODO
      EventBus.emit(new ToastEvent("INFO", `Not implemented yet, can't export ${bot_annotation_metadata_id}.`));
    },
    remove(meta: BotAnnotationMetaDataBaseModel) {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Do you really want to **permanently delete** all resolved annotations associated to the scope shown below?\n" +
            `- "${meta.name}"\n` +
            `- ID: ${meta.bot_annotation_metadata_id}`,
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.core.annotations
                .deleteSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdDelete({
                  botAnnotationMetadataId: meta.bot_annotation_metadata_id!,
                  xProjectId: currentProjectStore.projectId as string,
                })
                .then(() => {
                  EventBus.emit(new ToastEvent("SUCCESS", `Deleted ${meta.bot_annotation_metadata_id}`));
                  this.refreshData();
                })
                .catch(() => {
                  EventBus.emit(new ToastEvent("ERROR", `Failed to delete ${meta.bot_annotation_metadata_id}.`));
                });
            }
          },
          "Delete resolved annotations",
        ),
      );
    },
  },
});
</script>

<style scoped></style>
