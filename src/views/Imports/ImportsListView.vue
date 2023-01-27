<template>
  <div>
    <h2>Data import and query manager</h2>
    <ul>
      <li v-for="importDetails in imports" :key="importDetails.import_id">
        {{ importDetails.name }}
        <router-link
          :to="{ name: 'project-imports-details', params: { import_id: importDetails.import_id } }"
          class="link-secondary me-1">
          <InlineToolTip info="View and set up import">
            <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
          </InlineToolTip>
        </router-link>
        <a
          role="button"
          class="link-secondary me-1"
          aria-label="Copy import"
          tabindex="0"
          @click="copyImport(importDetails)">
          <InlineToolTip info="Copy">
            <font-awesome-icon :icon="['far', 'clone']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          aria-label="Delete import"
          tabindex="0"
          @click="removeImport(importDetails)">
          <InlineToolTip info="Delete">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          aria-label="Export items"
          tabindex="0"
          @click="exportData(importDetails)">
          <InlineToolTip info="Export items">
            <font-awesome-icon :icon="['fas', 'file-export']" />
          </InlineToolTip>
        </a>
      </li>
    </ul>
    <router-link
      role="button"
      class="btn btn-outline-primary m-2 btn-sm"
      :to="{ name: 'project-imports-details' }">
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create new import
    </router-link>
  </div>
</template>

<script lang="ts">
import type { ImportModel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { currentProjectStore } from '@/stores';
import { API, toastReject } from '@/plugins/api';
import { defineComponent } from 'vue';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';

export default defineComponent({
  name: 'ProjectListView',
  components: { InlineToolTip },
  data() {
    return {
      imports: [] as ImportModel[],
    };
  },
  async mounted() {
    API.core.imports.getAllImportsForProjectApiImportsListGet({
      xProjectId: currentProjectStore.projectId as string,
    })
      .then((response) => { this.imports = response.data; })
      .catch(toastReject);
  },
  methods: {
    copyImport(importDetails: ImportModel) {
      const newImport = JSON.parse(JSON.stringify(importDetails));
      newImport.import_id = null;
      newImport.time_created = null;
      newImport.name += ' copy';
      API.core.imports.putImportDetailsApiImportsImportPut({
        // @ts-ignore
        requestBody: newImport,
        xProjectId: currentProjectStore.projectId as string,
      })
        .then((response) => {
          const importId:string = response.data;
          newImport.import_id = importId;
          this.imports.push(newImport);
          EventBus.emit(new ToastEvent('SUCCESS', 'You successfuly copied this import configuration'));
        })
        .catch((reason) => {
          console.error(reason);
          EventBus.emit(new ToastEvent('ERROR', 'Could not copy this import.'));
        });
    },
    removeImport(importDetails: ImportModel) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Are you absolutely sure you want to delete this import?  \n'
        + 'Doing so will also delete all items that are attached to this (as long as they are not associated with any'
        + ' other imports). Any annotations associated with these items will also be lost.',
        (confirmationResponse) => {
          if (confirmationResponse === 'ACCEPT') {
            API.core.imports.deleteImportDetailsApiImportsImportDeleteImportIdDelete({
              // @ts-ignore
              importId: importDetails.import_id,
              xProjectId: currentProjectStore.projectId as string,
            })
              .then(() => {
                const importIndex = this.imports.findIndex(
                  (element: ImportModel) => element.import_id === importDetails.import_id
                );
                this.imports.splice(importIndex, 1);
                EventBus.emit(new ToastEvent('SUCCESS', 'You successfuly deleted this import and its related data.'));
              })
              .catch((reason) => {
                console.error(reason);
                EventBus.emit(new ToastEvent('ERROR', 'Could not delete this import.'));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'OK, did not delete your import.'));
          }
        },
        'Delete import',
        'I understand, delete it anyway!',
        'Cancel',
      ));
    },
    exportData(importDetails: ImportModel) {
      // TODO
      console.log(importDetails);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
  },
});
</script>

<style scoped>

</style>
