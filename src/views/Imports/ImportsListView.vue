<template>
  <div class="text-start m-2">
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
import { ImportModel } from '@/plugins/api/api-core';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { currentProjectStore } from '@/stores';
import { API, toastReject } from '@/plugins/api';

export default {
  name: 'ProjectListView',
  components: { InlineToolTip },
  data() {
    return {
      imports: [] as ImportModel[],
    };
  },
  async mounted() {
    API.core.imports.getAllImportsForProjectApiImportsListGet({
      xProjectId: currentProjectStore.projectId,
    })
      .then((response) => { this.imports = response.data; })
      .catch(toastReject);
  },
  methods: {
    copyImport(importDetails: ImportModel) {
      // TODO
      console.log(importDetails);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    removeImport(importDetails: ImportModel) {
      // TODO
      console.log(importDetails);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    exportData(importDetails: ImportModel) {
      // TODO
      console.log(importDetails);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
  },
};
</script>

<style scoped>

</style>
