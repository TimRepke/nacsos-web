<template>
  <div class="text-start p-2 container-fluid">
    <div class="row pb-2 mb-2 border-bottom g-0">
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
      <component :is="importConfigComponent"
                 :existing-config="importDetails.config"
                 :editable="!importStarted"
                 @config-changed="updateConfig($event)"></component>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import progress</h4>
      TODO
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import stats</h4>
      TODO
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { ref, Component } from 'vue';
import { callImportDetailsEndpoint, callImportItemCountEndpoint } from '@/plugins/api/imports';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { ToastEvent } from '@/plugins/events/events/toast';
import { EventBus } from '@/plugins/events';
import { ImportConfig, ImportModel, ImportTypeLiteral } from '@/types/imports.d';
import { Project, ProjectTypeLiteral } from '@/types/project.d';
import ConfigTwitter from '@/components/imports/ConfigTwitter.vue';
import ConfigJSONL from '@/components/imports/ConfigJSONL.vue';
import ConfigRIS from '@/components/imports/ConfigRIS.vue';

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
  async setup() {
    const route = useRoute();
    const importId = route.params.import_id as string;
    const { project } = useCurrentProjectStore();
    const userId = useCurrentUserStore().user?.user_id;

    let importDetails: ImportModel;
    let numItems: number;

    if (importId) {
      const requestResult = await callImportDetailsEndpoint({ importId });
      if (requestResult.status === 'SUCCESS' && requestResult.payload) {
        importDetails = requestResult.payload;
        numItems = (await callImportItemCountEndpoint()).payload as number;
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load import details. Please try reloading.'));
        throw Error('Something went wrong. Please tell the admin how you got here.');
      }
    }

    if (!importDetails) {
      importDetails = {
        project_id: project.project_id!,
        user_id: userId,
        type: undefined,
        name: '',
        description: '',
        config: undefined,
      };
    }
    if (!numItems) {
      numItems = 0;
    }

    return {
      importDetails: ref(importDetails),
      numItems,
      // indicates whether this is (or will be) a newly created import
      isNewImport: ref(!importId),
      importStarted: ref(false),
      currentProject: project as Project,
    };
  },
  methods: {
    updateConfig(eventPayload: ImportConfig | undefined) {
      this.importDetails.config = eventPayload;
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
