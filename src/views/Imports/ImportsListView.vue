<template>
  <div class="text-start m-2">
    <h2>Data import and query manager</h2>
    <ul>
      <li v-for="importDetails in imports" :key="importDetails.import_id">
        {{ importDetails.name }}
        <router-link :to="{ name:'project-imports-details', params: { import_id: importDetails.import_id } }"
                     class="link-secondary me-1">
          <InlineToolTip info="View and set up import">
            <font-awesome-icon :icon="['fas', 'screwdriver-wrench']"/>
          </InlineToolTip>
        </router-link>
        <a @click="copyImport(importDetails)" tabindex="0" aria-label="Copy import" class="link-secondary me-1"
           role="button">
          <InlineToolTip info="Copy">
            <font-awesome-icon :icon="['far', 'clone']"/>
          </InlineToolTip>
        </a>
        <a @click="removeImport(importDetails)" tabindex="0" aria-label="Delete import" class="link-secondary me-1"
           role="button">
          <InlineToolTip info="Delete">
            <font-awesome-icon :icon="['fas', 'trash-can']"/>
          </InlineToolTip>
        </a>
        <a @click="exportData(importDetails)" tabindex="0" aria-label="Export items" class="link-secondary me-1"
           role="button">
          <InlineToolTip info="Export items">
            <font-awesome-icon :icon="['fas', 'file-export']"/>
          </InlineToolTip>
        </a>
      </li>
    </ul>
    <router-link :to="{ name:'project-imports-details' }"
                 role="button" class="btn btn-outline-primary m-2 btn-sm">
      <font-awesome-icon :icon="['far', 'square-plus']"/>
      Create new import
    </router-link>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { callListProjectImportsEndpoint } from '@/plugins/api/imports';
import { ImportModel } from '@/types/imports.d';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';

export default {
  name: 'ProjectListView',
  components: { InlineToolTip },
  data() {
    return {
      imports: [] as ImportModel[],
    };
  },
  async mounted() {
    this.imports = (await callListProjectImportsEndpoint()).payload;
  },
  methods: {
    copyImport(importDetails: ImportModel) {
      // TODO
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    removeImport(importDetails: ImportModel) {
      // TODO
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    exportData(importDetails: ImportModel) {
      // TODO
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
  },
};
</script>

<style scoped>

</style>
