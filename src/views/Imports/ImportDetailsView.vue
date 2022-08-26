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
          <input
            type="text"
            class="form-control"
            id="importName"
            v-model="importDetails.name"
            placeholder="Import name" />
        </div>
        <div>
          <label for="importDescription" class="form-label">Description of this import</label>
          <textarea class="form-control" id="importDescription" rows="3" v-model="importDetails.description" />
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
        <component
          :is="importConfigComponent"
          :existing-config="importDetails.config"
          :editable="!importStarted"
          @config-changed="updateConfig($event)" />
        <button
          type="button"
          v-if="!importDetails.time_finished && !importDetails.time_started"
          class="btn btn-primary mt-3"
          @click="triggerImport">Initiate import
        </button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import progress</h4>
      <ul>
        <li><strong>Import created:</strong> {{ importDetails.time_created || '[not yet]' }}</li>
        <li><strong>Import started:</strong> {{ importDetails.time_started || '[not yet]' }}</li>
        <li><strong>Import finished:</strong> {{ importDetails.time_finished || '[not yet]' }}</li>
        <li v-if="importDetails.pipeline_task_id">
          <router-link
            :to="{
              name: 'project-artefacts-details',
              params: { taskId: importDetails.pipeline_task_id },
            }">
            &rrarr; Pipeline Task
          </router-link>
        </li>
      </ul>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import stats</h4>
      <div class="col">
        <button type="button" class="btn btn-outline-secondary" @click="loadImportStats">load</button>
        <ul>
          <li><strong>Number of items:</strong> {{ importStats.numItems || '[not loaded]' }}</li>
        </ul>
      </div>
    </div>
    <button type="button" class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue';
import { ToastEvent } from '@/plugins/events/events/toast';
import { EventBus } from '@/plugins/events';
import { CompatibilityMapping, ComponentMapping } from '@/types/imports.d';
import { ImportModel, ImportType, ProjectModel, ProjectPermissionsModel, ProjectType } from '@/plugins/client-core';
import ConfigTwitter from '@/components/imports/ConfigTwitter.vue';
import ConfigJSONL from '@/components/imports/ConfigJSONL.vue';
import ConfigRIS from '@/components/imports/ConfigRIS.vue';
import { currentProjectStore, currentUserStore } from '@/stores';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { coreAPI } from '@/plugins/api';

type ImportConfig = ImportModel['config'];

export const projectTypeImportTypeCompatibility: CompatibilityMapping = {
  basic: [ImportType.CSV, ImportType.JSONL, ImportType.SCRIPT],
  academic: [
    ImportType.RIS, ImportType.CSV, ImportType.JSONL, ImportType.SCRIPT, ImportType.WOS, ImportType.SCOPUS,
    ImportType.EBSCO, ImportType.JSTOR, ImportType.OVID, ImportType.POP,
  ],
  patents: [ImportType.CSV, ImportType.JSONL, ImportType.SCRIPT],
  twitter: [ImportType.CSV, ImportType.JSONL, ImportType.SCRIPT, ImportType.TWITTER],
};

const type2component: ComponentMapping = {
  ris: ['Upload RIS file(s)', ConfigRIS],
  jsonl: ['Upload JSONL file(s)', ConfigJSONL],
  twitter: ['Twitter Search API', ConfigTwitter],
};

type ImportDetails = {
  importId?: string;
  // indicates whether this is (or will be) a newly created import
  isNewImport: boolean;
  // indicates, whether this import was already performed (or started)
  importStarted: boolean;
  currentProject: ProjectModel;
  projectPermissions: ProjectPermissionsModel;
  importDetails: Omit<ImportModel, 'type'> & { type?: string };
  importStats: {
    numItems?: number;
  }
};

export default {
  name: 'ImportDetailsView',
  components: { ConfigRIS, ConfigJSONL, ConfigTwitter },
  data(): ImportDetails {
    const importId = this.$route.params.import_id;
    const userId = currentUserStore.user?.user_id;

    return {
      importId,
      isNewImport: !importId,
      importStarted: false,
      currentProject: currentProjectStore.project,
      projectPermissions: currentProjectStore.projectPermissions,
      importDetails: {
        project_id: currentProjectStore.projectId,
        user_id: userId,
        type: undefined,
        name: 'New import',
        description: '',
        config: undefined,
      },
      importStats: {
        numItems: undefined,
      },
    };
  },
  async mounted() {
    if (this.importId) {
      const importModel = await coreAPI.imports.getImportDetailsApiImportsImportImportIdGet({
        importId: this.importId,
        xProjectId: currentProjectStore.projectId,
      });
      if (importModel) {
        this.importDetails = importModel;
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load import details. Please try reloading.'));
      }
    }
  },
  methods: {
    updateConfig(eventPayload: ImportConfig) {
      this.importDetails.config = eventPayload;
    },
    save() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Saving does not actually import data, so if you are ready, click the import button after saving.  \n'
        + 'In case the import has already started, you can not change the configuration (only the description).',
        (response) => {
          if (response === 'ACCEPT') {
            coreAPI.imports.putImportDetailsApiImportsImportPut({
              requestBody: this.importDetails,
              xProjectId: currentProjectStore.projectId,
            })
              .then((res) => {
                EventBus.emit(new ToastEvent('SUCCESS', `Saved import settings.  \n**ID:** ${res}`));
                if (this.isNewImport) {
                  this.isNewImport = false;
                  this.$router.replace({ name: 'project-imports-details', params: { import_id: res } });
                }
              })
              .catch((res) => {
                EventBus.emit(new ToastEvent('ERROR', `Failed to save your import settings. (${res.message})`));
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
            coreAPI.imports.triggerImportApiImportsImportImportIdPost({
              importId: this.importId,
              xProjectId: currentProjectStore.projectId,
            })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Probably submitted an import job, may now take a while.'));
              })
              .catch((reason) => {
                console.error(reason);
                EventBus.emit(new ToastEvent('ERROR', 'Did not start importing data.'));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not start importing data.'));
          }
        },
        'Initiating import job',
        'Yes, proceed!',
        'Cancel',
      ));
    },
    async loadImportStats() {
      this.importStats.numItems = await coreAPI.imports.getImportCountsApiImportsImportImportIdCountGet({
        importId: this.importId,
        xProjectId: currentProjectStore.projectId,
      });
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
      const projectType: ProjectType = this.currentProject.type;
      const compatibleTypes = projectTypeImportTypeCompatibility[projectType];

      return Object.fromEntries(
        compatibleTypes
          .filter((importType: ImportType) => importType in type2component)
          .map((importType: ImportType) => [importType, type2component[importType]]),
      );
    },
  },
};
</script>

<style scoped>

</style>
