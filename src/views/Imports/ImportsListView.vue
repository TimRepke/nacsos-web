<template>
  <div>
    <div class="row mb-2">
      <h2>Data import and query manager</h2>
    </div>
    <div class="row mb-2" v-if="Object.keys(imports).length > 0">
      <div class="col">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" class="col-3" @click="resort('name')">
                Name
                <font-awesome-icon :icon="['fas', sorting.name]" />
              </th>
              <th scope="col" class="col-2" @click="resort('date')">
                Created
                <font-awesome-icon :icon="['fas', sorting.date]" />
              </th>
              <th scope="col" class="col-1 text-start">Finished</th>
              <th scope="col" class="col-1 text-start"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="importDetails in sortedFilteredImports" :key="importDetails.import_id as string">
              <router-link
                :to="{ name: 'project-imports-details', params: { import_id: importDetails.import_id } }"
                custom
                v-slot="{ navigate }"
              >
                <tr @click.stop="navigate" role="button">
                  <td class="col-3 text-start">
                    <pop-over
                      v-if="importDetails.description"
                      class="d-inline-block me-2"
                      title="Import description"
                      :body-m-d="importDetails.description"
                    />
                    {{ importDetails.name }}
                  </td>
                  <td class="col-2 text-muted text-start small">{{ $util.dt2str(importDetails.time_created) }}</td>
                  <td class="col-2 text-muted text-start small">{{ $util.dt2str(importDetails.time_finished) }}</td>
                  <td class="col-1 text-start">
                    <a
                      role="button"
                      class="link-secondary me-2"
                      aria-label="Copy import"
                      tabindex="0"
                      @click="copyImport(importDetails)"
                    >
                      <InlineToolTip info="Copy">
                        <font-awesome-icon :icon="['far', 'clone']" />
                      </InlineToolTip>
                    </a>
                    <a
                      role="button"
                      class="link-secondary me-2"
                      aria-label="Delete import"
                      tabindex="0"
                      @click="removeImport(importDetails)"
                    >
                      <InlineToolTip info="Delete">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                      </InlineToolTip>
                    </a>
                    <!--                    <a-->
                    <!--                      role="button"-->
                    <!--                      class="link-secondary me-2"-->
                    <!--                      aria-label="Export items"-->
                    <!--                      tabindex="0"-->
                    <!--                      @click="exportData(importDetails)"-->
                    <!--                    >-->
                    <!--                      <InlineToolTip info="Export items">-->
                    <!--                        <font-awesome-icon :icon="['fas', 'file-export']" />-->
                    <!--                      </InlineToolTip>-->
                    <!--                    </a>-->
                    <router-link
                      v-if="importDetails.pipeline_task_id"
                      role="button"
                      class="link-secondary me-2"
                      aria-label="Pipeline task"
                      :to="{
                        name: 'project-artefacts-details',
                        params: { taskId: importDetails.pipeline_task_id },
                      }"
                    >
                      <InlineToolTip info="Pipeline task">
                        <font-awesome-icon :icon="['fas', 'vault']" />
                      </InlineToolTip>
                    </router-link>
                  </td>
                </tr>
              </router-link>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else>
      <div class="card mb-3" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-2 position-relative">
            <font-awesome-icon
              :icon="['fas', 'tags']"
              class="position-absolute top-50 start-50 translate-middle img-fluid text-muted"
            />
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">No imports, yet!</h5>
              <p class="card-text">Trying to load imports for you, so far, it looks like there are none to be found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-link role="button" class="btn btn-outline-primary m-2 btn-sm" :to="{ name: 'project-imports-details' }">
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create new import
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { ImportModel } from "@/plugins/api/types";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { currentProjectStore } from "@/stores";
import { API, toastReject } from "@/plugins/api";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import PopOver from "@/components/PopOver.vue";

enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

export default defineComponent({
  name: "ProjectListView",
  components: { PopOver, InlineToolTip },
  data() {
    return {
      sorting: {
        name: Sort.sort,
        date: Sort["sort-down"],
      } as Record<string, Sort>,
      imports: {} as Record<string, ImportModel>,
    };
  },
  async mounted() {
    API.imports
      .getAllImportsForProjectApiImportsListGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.imports = Object.fromEntries(response.data.map((i) => [i.import_id, i]));
      })
      .catch(toastReject);
  },
  methods: {
    resort(field: string) {
      const currentVal: Sort = this.sorting[field];
      // reset all other column sorters
      if (field !== "name") this.sorting.name = Sort.sort;
      if (field !== "date") this.sorting.date = Sort.sort;

      // cycle through states
      if (currentVal === Sort.sort) {
        this.sorting[field] = Sort["sort-up"];
      } else if (currentVal === Sort["sort-up"]) {
        this.sorting[field] = Sort["sort-down"];
      } else if (currentVal === Sort["sort-down"]) {
        this.sorting[field] = Sort.sort;
      }
    },
    copyImport(importDetails: ImportModel) {
      const newImport: ImportModel = JSON.parse(JSON.stringify(importDetails));

      // drop previous identifiers to be generated by the database for the copy
      newImport.import_id = undefined;
      newImport.time_created = undefined;
      newImport.time_started = undefined;
      newImport.time_finished = undefined;
      newImport.pipeline_task_id = undefined;

      // append "copy", so that the user has a chance to distinguish the new entry from the old one
      newImport.name += " copy";

      API.imports
        .putImportDetailsApiImportsImportPut({
          requestBody: newImport,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          // attach new data to the cloned import object
          newImport.import_id = response.data;
          // reset the import_id in the pipeline config
          if (newImport.config && "import_id" in newImport.config) {
            newImport.config.import_id = response.data;
          }

          // save again since we changed the config
          API.imports
            .putImportDetailsApiImportsImportPut({
              requestBody: newImport,
              xProjectId: currentProjectStore.projectId as string,
            })
            .then(() => {
              newImport.time_created = new Date().toISOString(); // FIXME: not quite the correct format

              // ... and add it to the list of imports
              this.imports[response.data] = newImport;

              EventBus.emit(
                new ToastEvent(
                  "SUCCESS",
                  "You successfully copied this import configuration. " +
                    "Please remember renaming it in order to use the copied configuration.",
                ),
              );
            });
        })
        .catch((reason) => {
          console.error(reason);
          EventBus.emit(new ToastEvent("ERROR", "Could not copy this import."));
        });
    },
    removeImport(importDetails: ImportModel) {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Are you absolutely sure you want to delete this import?  \n" +
            "Doing so will also delete all items that are attached to this (as long as they are not associated with any " +
            "other imports). Any annotations associated with these items will also be lost.",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.imports
                .deleteImportDetailsApiImportsImportDeleteImportIdDelete({
                  // @ts-ignore
                  importId: importDetails.import_id,
                  xProjectId: currentProjectStore.projectId as string,
                })
                .then(() => {
                  // drop from the list of import objects
                  delete this.imports[importDetails.import_id as string];

                  EventBus.emit(
                    new ToastEvent("SUCCESS", "You successfully deleted this import and its related data."),
                  );
                })
                .catch((reason) => {
                  console.error(reason);
                  EventBus.emit(new ToastEvent("ERROR", "Could not delete this import."));
                });
            } else {
              EventBus.emit(new ToastEvent("WARN", "OK, did not delete your import."));
            }
          },
          "Delete import",
          "I understand, delete it anyway!",
          "Cancel",
        ),
      );
    },
    exportData(importDetails: ImportModel) {
      // TODO
      console.log(importDetails);
      EventBus.emit(new ToastEvent("WARN", "Not implemented yet, sorry."));
    },
  },
  computed: {
    filteredImports(): ImportModel[] {
      return Object.values(this.imports);
    },
    sortedFilteredImports(): ImportModel[] {
      let comparator: (p1: ImportModel, p2: ImportModel) => [string, string] | [number, number];
      let dir: Sort;
      if (this.sorting.name !== Sort.sort) {
        comparator = (p1: ImportModel, p2: ImportModel) => [p1.name as string, p2.name as string];
        dir = this.sorting.name;
      } else if (this.sorting.date !== Sort.sort) {
        comparator = (p1: ImportModel, p2: ImportModel) => [p1.time_created as string, p2.time_created as string];
        dir = this.sorting.date;
      } else {
        return this.filteredImports;
      }

      return this.filteredImports.toSorted((p1: ImportModel, p2: ImportModel) => {
        const [v1, v2] = comparator(p1, p2);
        if (v1 < v2) return dir === Sort["sort-up"] ? -1 : 1;
        if (v1 > v2) return dir === Sort["sort-up"] ? 1 : -1;
        return 0;
      });
    },
  },
});
</script>

<style scoped></style>
