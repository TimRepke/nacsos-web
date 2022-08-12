<template>
  <div class="text-start p-2 container-fluid">
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1 v-if="isNewImport">Create new data import</h1>
        <h1 v-else>Data import overview</h1>
        <h6>
          An "import" provides the scope for how data enters a project.
          You can either configure a query to import from external scholarly databases, Twitter,
          or upload files directly.
          Please note, that only one "type" of data can exist in a project.
          This project is configured for <strong>{{ currentProject.type }}</strong>.
        </h6>
      </div>
    </div>

    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-6">
        <h4>Basic information</h4>
        <div class="mb-3">
          <label for="importName" class="form-label">Name for this import</label>
          <input type="text" class="form-control" id="importName" v-model="importDetails.name"
                 placeholder="Import name"/>
        </div>
        <div>
          <label for="importDescription" class="form-label">Description of this import</label>
          <textarea class="form-control" id="importDescription" rows="3" v-model="importDetails.description"></textarea>
        </div>
      </div>
    </div>

    <div class="row pb-2 mb-2 border-bottom g-0" v-if="!importDetails.config || !importStarted">
      <div class="col">
        <h4>Select import type</h4>
        <select v-model="importDetails.type" aria-label="Import Config Option">
          <option disabled :value="undefined">Select import type</option>
          <option v-for="(info, type) in compatibleImportTypes" :key="type" :value="type">{{ info[0] }}</option>
        </select>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="importConfigComponent !== undefined">
      <div class="col">
        <component :is="importConfigComponent"
                   :existing-config="importDetails.config"
                   :editable="!importStarted"
                   @config-changed="updateConfig($event)"></component>
        <button class="btn btn-primary mt-3" @click="triggerImport">Initiate import</button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import progress</h4>
      TODO
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import stats</h4>
      TODO
    </div>
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { callImportDetailsEndpoint, callImportItemCountEndpoint, callSaveImportEndpoint } from '@/plugins/api/imports';
import { ToastEvent } from '@/plugins/events/events/toast';
import { EventBus } from '@/plugins/events';
import { ImportConfig, ImportModel, ImportTypeLiteral } from '@/types/imports.d';
import { Project, ProjectPermissions, ProjectTypeLiteral } from '@/types/project.d';
import ConfigTwitter from '@/components/imports/ConfigTwitter.vue';
import ConfigJSONL from '@/components/imports/ConfigJSONL.vue';
import ConfigRIS from '@/components/imports/ConfigRIS.vue';
import { currentProjectStore, currentUserStore } from '@/stores';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';

// FIXME: figure out how to move this block to @/types/imports.d without compile errors
type ComponentMapping = { [key in ImportTypeLiteral]?: [string, Component] };
type CompatibilityMapping = { [key in ProjectTypeLiteral]: ImportTypeLiteral[] };
const projectTypeImportTypeCompatibility: CompatibilityMapping = {
  basic: ['csv', 'jsonl', 'script'],
  academic: ['ris', 'csv', 'jsonl', 'script', 'wos', 'scopus', 'ebsco', 'jstor', 'ovid', 'pop'],
  patents: ['csv', 'jsonl', 'script'],
  twitter: ['csv', 'jsonl', 'script', 'twitter'],
};

const type2component: ComponentMapping = {
  ris: ['Upload RIS file(s)', ConfigRIS],
  jsonl: ['Upload JSONL file(s)', ConfigJSONL],
  twitter: ['Twitter Search API', ConfigTwitter],
};

export default {
  name: 'ImportDetailsView',
  components: { ConfigRIS, ConfigJSONL, ConfigTwitter },
  data() {
    const { project } = currentProjectStore;
    const importId: string = this.$route.params.import_id;
    const userId = currentUserStore.user?.user_id;

    return {
      importId,
      // indicates whether this is (or will be) a newly created import
      isNewImport: !importId,
      // indicates, whether this import was already performed (or started)
      importStarted: false,
      currentProject: project as Project,
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissions,
      numItems: 0 as number,
      importDetails: {
        project_id: project.project_id,
        user_id: userId,
        type: undefined,
        name: 'New import',
        description: '',
        config: undefined,
      } as ImportModel,
    };
  },
  async mounted() {
    if (this.importId) {
      const requestResult = await callImportDetailsEndpoint({ importId: this.importId });
      if (requestResult.status === 'SUCCESS' && requestResult.payload) {
        this.importDetails = requestResult.payload;
        this.numItems = (await callImportItemCountEndpoint({ importId: this.importId })).payload as number;
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load import details. Please try reloading.'));
      }
    }
  },
  methods: {
    updateConfig(eventPayload: ImportConfig | undefined) {
      this.importDetails.config = eventPayload;
    },
    save() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Saving does not actually import data, so if you are ready, click the import button after saving.  \n'
        + 'In case the import has already started, you can not change the configuration (only the description).',
        (response) => {
          if (response === 'ACCEPT') {
            //
            // FIXME handle file uploads
            //
            callSaveImportEndpoint(this.importDetails)
              .then((res) => {
                EventBus.emit(new ToastEvent('SUCCESS', `Saved import settings.  \n**ID:** ${res.payload}`));
                if (this.isNewImport) {
                  this.isNewImport = false;
                  this.$router.replace({ name: 'project-imports-details', params: { import_id: res.payload } });
                }
              })
              .catch((res) => {
                EventBus.emit(new ToastEvent('ERROR', `Failed to save your import settings. (${res.reason})`));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not save your import config.'));
          }
        },
        'Save import job',
        'OK, save!',
        'Cancel',
      ));
    },
    triggerImport() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Importing data may allocate a lot of resources (storage, quality checks, deduplication, '
        + 'data provider costs or limits,...) and/or simply take a long time to complete.  \n'
        + 'Please only proceed if you are sure about the implications.\n\n'
        + 'Make sure to **click save before importing**!',
        (response) => {
          if (response === 'ACCEPT') {
            EventBus.emit(new ToastEvent('WARN', 'Lol, not implemented yet.'));
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not start importing data.'));
          }
        },
        'Initiating import job',
        'Yes, proceed!',
        'Cancel',
      ));
    },
  },
  computed: {
    importConfigComponent(): Component | undefined {
      if (this.importDetails.type !== undefined && this.importDetails.type in this.compatibleImportTypes) {
        return this.compatibleImportTypes[this.importDetails.type][1];
      }
      return undefined;
    },
    compatibleImportTypes() {
      const projectType: ProjectTypeLiteral = this.currentProject.type;
      const compatibleTypes: ImportTypeLiteral[] = projectTypeImportTypeCompatibility[projectType];

      return Object.fromEntries(
        compatibleTypes
          .filter((importType: ImportTypeLiteral) => importType in type2component)
          .map((importType: ImportTypeLiteral) => [importType, type2component[importType]]),
      );
    },
  },
};
</script>

<style scoped>

</style>
