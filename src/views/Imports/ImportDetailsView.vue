<template>
  <div class="container-fluid">
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1 v-if="isNewImport">Create new data import</h1>
        <h1 v-else>Data import overview</h1>
        <h6>
          An "import" provides the scope for how data enters a project. You can either configure a query to import from
          external scholarly databases, Twitter, or upload files directly. Please note, that only one "type" of data can
          exist in a project. This project is configured for <strong>{{ currentProject.type }}</strong
          >.
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
            placeholder="Import name"
          />
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
        <select v-model="importDetails.type" aria-label="Import Config Option" :disabled="importStarted">
          <option disabled :value="undefined">Select import type</option>
          <option v-for="(info, type) in compatibleImportTypes" :key="type" :value="type">{{ info.name }}</option>
        </select>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="importConfigComponent !== undefined">
      <div class="col">
        <component
          :is="importConfigComponent"
          :existing-config="importDetails.config"
          :editable="!importStarted"
          :project-id="importDetails.project_id"
          :import-id="importId"
          @config-changed="updateConfig($event)"
        />
        <button
          type="button"
          v-if="!importDetails.time_finished && !importDetails.time_started"
          class="btn btn-primary mt-3"
          @click="triggerImport"
        >
          Initiate import
        </button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Import progress</h4>
      <ul>
        <li><strong>Import created:</strong> {{ importDetails.time_created || "[not yet]" }}</li>
        <li><strong>Import started:</strong> {{ importDetails.time_started || "[not yet]" }}</li>
        <li><strong>Import finished:</strong> {{ importDetails.time_finished || "[not yet]" }}</li>
        <li v-if="importDetails.pipeline_task_id">
          <router-link
            :to="{
              name: 'project-artefacts-details',
              params: { taskId: importDetails.pipeline_task_id },
            }"
          >
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
          <li v-if="importStats.numItems !== undefined">
            <strong>Number of items:</strong> {{ importStats.numItems }}
          </li>
        </ul>
      </div>
    </div>
    <button type="button" class="btn btn-success position-fixed" style="top: 4rem; right: 1rem" @click="save()">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Component } from "vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import { EventBus } from "@/plugins/events";
import { ItemType } from "@/plugins/api/api-core";
import type { ImportModel, ProjectModel, ProjectPermissionsModel } from "@/plugins/api/api-core";
import ConfigTwitter from "@/components/imports/ConfigTwitter.vue";
import ConfigWoS from "@/components/imports/ConfigWoS.vue";
import ConfigJSONLOpenAlexWorks from "@/components/imports/ConfigJSONLOpenAlexWorks.vue";
import ConfigJSONLAcademicItem from "@/components/imports/ConfigJSONLAcademicItem.vue";
import ConfigJSONLTwitterAPI from "@/components/imports/ConfigJSONLTwitterAPI.vue";
import ConfigJSONLTwitterDb from "@/components/imports/ConfigJSONLTwitterDb.vue";
import ConfigScopus from "@/components/imports/ConfigScopus.vue";
import { currentProjectStore, currentUserStore } from "@/stores";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { API, logReject, toastReject } from "@/plugins/api";
import ConfigOpenAlex from "@/components/imports/ConfigOpenAlex.vue";

type ImportConfig = ImportModel["config"];

interface ConfigOption {
  component: Component;
  name: string;
}

const configs: Record<string, ConfigOption> = {
  wos: {
    component: ConfigWoS,
    name: "Upload Web of Science text file(s)",
  },
  scopusCSV: {
    component: ConfigScopus,
    name: "Upload Scopus CSV file(s)",
  },
  oa: {
    component: ConfigOpenAlex,
    name: "Import from OpenAlex (Solr)",
  },
  oaFile: {
    component: ConfigJSONLOpenAlexWorks,
    name: "Upload OpenAlex file",
  },
  academicFile: {
    component: ConfigJSONLAcademicItem,
    name: "Upload JSONl file (AcademicItemModel)",
  },
  twitterApi: {
    component: ConfigTwitter,
    name: "Twitter Search API",
  },
  twitterDbFile: {
    component: ConfigJSONLTwitterDb,
    name: "Import JSONl file (TwitterItemModel)",
  },
  twitterApiFile: {
    component: ConfigJSONLTwitterAPI,
    name: "Import JSONl file (API dump)",
  },
};

export const projectTypeImportTypeCompatibility: { [key in ProjectModel["type"]]: string[] } = {
  academic: ["academicFile", "oaFile", "oa", "scopusCSV", "wos"],
  twitter: ["twitterApi", "twitterApiFile", "twitterDbFile"],
  lexis: [],
  generic: [],
  patents: [],
};

type ImportDetails = {
  importId?: string;
  // indicates whether this is (or will be) a newly created import
  isNewImport: boolean;
  // indicates, whether this import was already performed (or started)
  importStarted: boolean;
  currentProject: ProjectModel;
  projectPermissions: ProjectPermissionsModel;
  importDetails: Omit<ImportModel, "type"> & { type?: string };
  importStats: {
    numItems?: number;
  };
};

export default defineComponent({
  name: "ImportDetailsView",
  components: {
    ConfigJSONLTwitterDb,
    ConfigScopus,
    ConfigWoS,
    ConfigJSONLTwitterAPI,
    ConfigTwitter,
    ConfigJSONLAcademicItem,
    ConfigJSONLOpenAlexWorks,
    ConfigOpenAlex,
  },
  data(): ImportDetails {
    const importId = this.$route.params.import_id;
    const userId = currentUserStore.user?.user_id;

    return {
      importId: importId as string | undefined,
      isNewImport: !importId,
      importStarted: false,
      currentProject: currentProjectStore.project as ProjectModel,
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissionsModel,
      importDetails: {
        project_id: currentProjectStore.projectId,
        user_id: userId,
        type: undefined,
        name: "New import",
        description: "",
        config: undefined,
      } as Omit<ImportModel, "type"> & { type?: string },
      importStats: {
        numItems: undefined,
      },
    };
  },
  async mounted() {
    this.fetchImportDetails();
  },
  methods: {
    fetchImportDetails(onDone?: () => void) {
      if (this.importId) {
        API.core.imports
          .getImportDetailsApiImportsImportImportIdGet({
            importId: this.importId,
            xProjectId: currentProjectStore.projectId as string,
          })
          .then((response) => {
            this.importDetails = response.data;
            this.importStarted = !!this.importDetails.time_started;
            if (onDone) {
              onDone();
            }
          })
          .catch(toastReject);
      }
    },
    updateConfig(eventPayload: ImportConfig) {
      this.importDetails.config = eventPayload;
    },
    save() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Saving does not actually import data, so if you are ready, click the import button after saving.  \n" +
            "In case the import has already started, you can not change the configuration (only the description).",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              this.saveRequest();
            } else {
              EventBus.emit(new ToastEvent("WARN", "Did not save your import config."));
            }
          },
          "Save import job",
          "OK, save!",
          "Cancel",
        ),
      );
    },
    async saveRequest() {
      API.core.imports
        .putImportDetailsApiImportsImportPut({
          // @ts-ignore
          requestBody: this.importDetails,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          EventBus.emit(new ToastEvent("SUCCESS", `Saved import settings.  \n**ID:** ${response.data}`));
          if (this.isNewImport) {
            this.isNewImport = false;

            const newImportId = response.data;
            this.importId = newImportId;
            this.$router.replace({ name: "project-imports-details", params: { import_id: response.data } });

            // Some configs include the import_id, which we get after saving.
            // Thus, we save it again to update the config in the database.
            this.importDetails = {
              project_id: currentProjectStore.projectId,
              user_id: "userId",
              type: undefined,
              name: "New import",
              description: "",
              config: undefined,
            } as Omit<ImportModel, "type"> & { type?: string };
            this.fetchImportDetails(() => {
              this.importId = undefined;
              this.importId = newImportId;
              this.saveRequest();
            });
          }
        })
        .catch((reason) => {
          EventBus.emit(new ToastEvent("ERROR", `Failed to save your import settings. (${reason.error?.type})`));
        });
    },
    triggerImport() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Importing data may allocate a lot of resources (storage, quality checks, deduplication, " +
            "data provider costs or limits,...) and/or simply take a long time to complete.  \n" +
            "Please only proceed if you are sure about the implications.\n\n" +
            "Make sure to **click save before importing**!",
          (response) => {
            if (response === "ACCEPT") {
              API.core.imports
                .triggerImportApiImportsImportImportIdPost({
                  importId: this.importId as string,
                  xProjectId: currentProjectStore.projectId as string,
                })
                .then(() => {
                  this.importStarted = true;
                  EventBus.emit(new ToastEvent("SUCCESS", "Probably submitted an import job, may now take a while."));
                })
                .catch((reason) => {
                  console.error(reason);
                  EventBus.emit(new ToastEvent("ERROR", "Did not start importing data."));
                });
            } else {
              EventBus.emit(new ToastEvent("WARN", "Did not start importing data."));
            }
          },
          "Initiating import job",
          "Yes, proceed!",
          "Cancel",
        ),
      );
    },
    async loadImportStats() {
      API.core.imports
        .getImportCountsApiImportsImportImportIdCountGet({
          importId: this.importId as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.importStats.numItems = response.data;
        })
        .catch(logReject);
    },
  },
  computed: {
    importConfigComponent(): Component | undefined {
      if (this.importDetails.type !== undefined && this.importDetails.type in this.compatibleImportTypes) {
        return this.compatibleImportTypes[this.importDetails.type].component;
      }
      return undefined;
    },
    compatibleImportTypes(): Record<string, ConfigOption> {
      const projectType: ProjectModel["type"] = this.currentProject.type as ItemType;
      const compatibleTypes = projectTypeImportTypeCompatibility[projectType];

      // @ts-ignore FIXME
      return Object.fromEntries(
        compatibleTypes
          .filter((importType: string) => importType in configs)
          .map((importType: string) => [importType, configs[importType]]),
      );
    },
  },
});
</script>

<style scoped></style>
