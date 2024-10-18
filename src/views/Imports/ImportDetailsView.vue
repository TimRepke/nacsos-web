<script setup lang="ts">
import type { ImportModel, ImportRevisionDetails, ProjectModel } from "@/plugins/api/spec";
import { computed, onMounted, ref } from "vue";
import type { Component } from "vue";
import ConfigWoS from "@/components/imports/ConfigWoS.vue";
import ConfigScopus from "@/components/imports/ConfigScopus.vue";
import ConfigOpenAlex from "@/components/imports/ConfigOpenAlex.vue";
import ConfigJSONLOpenAlexWorks from "@/components/imports/ConfigJSONLOpenAlexWorks.vue";
import ConfigJSONLAcademicItem from "@/components/imports/ConfigJSONLAcademicItem.vue";
import { currentProjectStore, currentUserStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import { API, ignore, toastReject } from "@/plugins/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ImportCount from "@/components/imports/ImportCount.vue";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { ToastEvent } from "@/plugins/events/events/toast";

type ImportConfig = ImportModel["config"];

interface ConfigOption {
  component: Component;
  name: string;
}

const configs: { [key in ProjectModel["type"]]: Record<string, ConfigOption> } = {
  academic: {
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
  },
  twitter: {},
  lexis: {},
  generic: {},
  patents: {},
};

const route = useRoute();
const router = useRouter();

const importInfo = ref<ImportModel>({
  import_id: (route.params.import_id as string) || crypto.randomUUID().toString(),
  name: "New import",
  description: "",
  project_id: currentProjectStore.projectId as string,
  user_id: currentUserStore.user?.user_id,
  type: "oa",
  config: null,
});
const wasSaved = ref<boolean>(false);
const importRevisions = ref<ImportRevisionDetails[]>([]);

// Config type can only be changed before the first revision
const isTypeChangeable = computed(() => importRevisions.value.length === 0);

// Settings should only be editable while no task is running (or the forceful flag was set)
const _settingsEditable = ref<boolean>(true); // FIXME: should default really be true?
const settingsEditable = computed(
  () =>
    _settingsEditable.value &&
    importRevisions.value[0]?.task?.status !== "RUNNING" &&
    importRevisions.value[0]?.task?.status !== "PENDING",
);
const isConfigured = computed(() => !!importInfo.value.config);
const canBeInitiated = computed(() => !currentProjectStore.hasRunningImport && isConfigured.value && wasSaved.value);

function updateConfig(eventPayload: ImportConfig) {
  importInfo.value.config = eventPayload;
}

function reloadInfo() {
  API.imports
    .getImportDetailsApiImportsImportImportIdGet({
      importId: importInfo.value.import_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
    .then((response) => {
      importInfo.value = response.data;
      wasSaved.value = true;
    })
    .catch(ignore);
  API.imports
    .getImportRevisionsApiImportsImportImportIdRevisionsGet({
      importId: importInfo.value.import_id as string,
      xProjectId: currentProjectStore.projectId as string,
    })
    .then((response) => {
      importRevisions.value = response.data;
    })
    .catch(toastReject);
}

function initiateRevision() {
  if (!canBeInitiated.value) return;
  EventBus.emit(
    new ConfirmationRequestEvent(
      "Importing data may allocate a lot of resources (storage, quality checks, deduplication, " +
        "data provider costs or limits,...) and/or simply take a long time to complete.  \n" +
        "Please only proceed if you are sure about the implications.\n\n" +
        "Make sure to **click save before importing**!",
      (response) => {
        if (response === "ACCEPT") {
          API.imports
            .triggerImportApiImportsImportImportIdPost({
              importId: importInfo.value.import_id as string,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then(() => {
              _settingsEditable.value = false;
              currentProjectStore.project!.import_mutex = true;
              EventBus.emit(
                new ToastEvent(
                  "SUCCESS",
                  "Probably submitted an import job, may now take a while. Wait and press F5 to check status.",
                ),
              );
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
}

function save() {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "Saving does not actually import data, so if you are ready, click the 'initiate' button after saving.  \n" +
        "In case the import has already started, you should not change the settings (name and description should be fine though).",
      (confirmationResponse) => {
        if (confirmationResponse === "ACCEPT") {
          API.imports
            .putImportDetailsApiImportsImportPut({
              // @ts-ignore
              requestBody: importInfo.value,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then((response) => {
              EventBus.emit(new ToastEvent("SUCCESS", `Saved import settings.  \n**ID:** ${response.data}`));
              router.replace({ name: "project-imports-details", params: { import_id: response.data } });
              wasSaved.value = true;
              reloadInfo();
            })
            .catch((reason) => {
              EventBus.emit(new ToastEvent("ERROR", `Failed to save your import settings. (${reason.error?.type})`));
            });
        } else {
          EventBus.emit(new ToastEvent("WARN", "Did not save your import config."));
        }
      },
      "Save import job",
      "OK, save!",
      "Cancel",
    ),
  );
}

const importConfigComponent = computed(() => {
  return configs[currentProjectStore.project!.type]?.[importInfo.value.type]?.component;
});

onMounted(reloadInfo);
</script>

<template>
  <div>
    <div class="row pb-2 mb-2">
      <div class="col-11 col-md-8">
        <h1>
          <font-awesome-icon icon="cloud-arrow-up" />
          Data import
        </h1>
        <h6>
          An "import" provides the scope for how data enters a project. The system creates a "revision" for each time an
          import is run (assuming with the same query and settings, but at a later time). You can only run a single
          import at a time per project.
        </h6>
      </div>
      <div class="col text-end">
        <button type="button" class="btn btn-success" @click="save">Save</button>
      </div>
    </div>

    <div class="row g-2 mb-4">
      <div class="col-lg-4">
        <div class="p-2 card">
          <h4>Import info</h4>
          <div class="mb-3">
            <label for="importName" class="form-label">Name for this import</label>
            <input
              type="text"
              class="form-control"
              id="importName"
              v-model="importInfo.name"
              placeholder="Import name"
            />
          </div>
          <div class="mb-3">
            <label for="importDescription" class="form-label">Description of this import</label>
            <textarea class="form-control" id="importDescription" rows="3" v-model="importInfo.description" />
          </div>
          <div>
            <strong>Import created:</strong>&nbsp;
            {{ importInfo.time_created || "[not yet]" }}
          </div>
          <div>
            <strong>Number of items:</strong>&nbsp;
            <ImportCount :import-id="importInfo.import_id" />
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="p-2 card">
          <h4>Settings</h4>

          <div class="row pb-2 mb-2 border-bottom g-0" v-if="isTypeChangeable">
            <div class="col">
              <h5>Select import type</h5>
              <select v-model="importInfo.type" aria-label="Import Config Option" :disabled="!settingsEditable">
                <option disabled :value="undefined">Select import type</option>
                <option v-for="(info, type) in configs[currentProjectStore.project.type]" :key="type" :value="type">
                  {{ info.name }}
                </option>
              </select>
            </div>
          </div>

          <component
            v-if="importConfigComponent"
            :is="importConfigComponent"
            :existing-config="importInfo.config"
            :editable="settingsEditable"
            :import-id="importInfo.import_id"
            @config-changed="updateConfig($event)"
          />
        </div>
      </div>
    </div>

    <div class="row mb-2">
      <div class="col">
        <h3>Revisions</h3>
      </div>
      <div class="col text-end">
        <button type="button" :disabled="!canBeInitiated" class="btn btn-outline-primary" @click="initiateRevision">
          <font-awesome-icon icon="play" class="me-1" />
          Initiate import revision
        </button>
      </div>
    </div>

    <div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Counter</th>
            <th>Timestamp</th>
            <th>Query size</th>
            <th>Import size</th>
            <th># New</th>
            <th># updated</th>
            <th># removed</th>
            <th>Pipeline</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="revision in importRevisions" v-bind:key="revision.import_revision_id">
            <td>{{ revision.import_revision_counter }}</td>
            <td>{{ revision.time_created }}</td>
            <td>{{ revision.num_items_retrieved }}</td>
            <td>{{ revision.num_items }}</td>
            <td>{{ revision.num_items_new }}</td>
            <td>{{ revision.num_items_updated }}</td>
            <td>{{ revision.num_items_removed }}</td>
            <td>
              <template v-if="revision.task">
                <InlineToolTip :info="revision.task.status">
                  <span
                    class="fs-3 me-2"
                    :class="{
                      'text-tertiary': revision.task.status === 'PENDING',
                      'text-warning': revision.task.status === 'RUNNING',
                      'text-success': revision.task.status === 'COMPLETED',
                      'text-error': revision.task.status === 'FAILED',
                      'text-secondary': revision.task.status === 'CANCELLED',
                    }"
                    >●</span
                  >
                </InlineToolTip>
                <router-link
                  role="button"
                  class="link-secondary me-2"
                  aria-label="Pipeline task"
                  :to="{
                    name: 'project-artefacts-details',
                    params: { taskId: revision.pipeline_task_id },
                  }"
                >
                  <InlineToolTip :info="`Pipeline task: ${revision.pipeline_task_id}`">
                    <font-awesome-icon :icon="['fas', 'vault']" />
                  </InlineToolTip>
                </router-link>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
