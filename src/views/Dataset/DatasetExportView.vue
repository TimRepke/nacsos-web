<template>
  <div>
    <h1>Download/Export Data</h1>

    <div class="row gy-4 gx-5">
      <div class="col-lg-3">
        <h4>Options</h4>
        <div class="card">
          <div class="card-body">
            <div class="form-check form-switch">
              <input
                v-model="labelExportSettings.ignoreHierarchy"
                :aria-checked="labelExportSettings.ignoreHierarchy"
                id="settingsIgnoreHierarchy"
                class="form-check-input"
                type="checkbox"
                role="switch"
                disabled
              />
              <label class="form-check-label" for="settingsIgnoreHierarchy"> Ignore annotation hierarchy </label>
            </div>
            <div class="form-check form-switch">
              <input
                v-model="labelExportSettings.ignoreOrder"
                :aria-checked="labelExportSettings.ignoreOrder"
                id="settingsIgnoreOrder"
                class="form-check-input"
                type="checkbox"
                role="switch"
              />
              <label class="form-check-label" for="settingsIgnoreOrder"> Ignore annotation order </label>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <h4>NQL item filter</h4>
        <n-q-l-box
          :query="nqlQuery"
          @update:query-parsed="(newFilter: NQLFilter) => (labelExportSettings.nqlFilter = newFilter)"
        />
      </div>

      <div class="col-lg-4">
        <h4>Users</h4>
        <p>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="checkAllUsers">
            <font-awesome-icon :icon="['fas', 'list-check']" class="me-2" />
            Select all
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="labelExportSettings.userIds = []">
            <font-awesome-icon :icon="['fas', 'list-ul']" class="me-2" />
            Unselect all
          </button>
        </p>
        <ul class="list-group">
          <li v-for="user in projectUsers" :key="user.id" class="list-group-item">
            <input
              :id="`pu-${user.id}`"
              :value="user.id"
              v-model="labelExportSettings.userIds"
              class="form-check-input me-1"
              type="checkbox"
            />
            <label :for="`pu-${user.id}`" class="form-check-label stretched-link">
              {{ user.name }}
            </label>
          </li>
        </ul>
      </div>

      <div class="col-lg-4">
        <h4>Assignment Scopes</h4>
        <p>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="checkAllScopes">
            <font-awesome-icon :icon="['fas', 'list-check']" class="me-2" />
            Select all
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="labelExportSettings.assignmentScopeIds = []"
          >
            <font-awesome-icon :icon="['fas', 'list-ul']" class="me-2" />
            Unselect all
          </button>
        </p>
        <ul class="list-group">
          <li v-for="scope in projectScopes" :key="scope.id" class="list-group-item">
            <input
              :id="`pas-${scope.id}`"
              :value="scope.id"
              v-model="labelExportSettings.assignmentScopeIds"
              class="form-check-input me-1"
              type="checkbox"
            />
            <label :for="`pas-${scope.id}`" class="form-check-label stretched-link">
              {{ scope.name }}<br />
              <span class="text-muted small">{{ scope.scheme_name }}</span>
            </label>
          </li>
        </ul>
      </div>

      <div class="col-lg-4">
        <h4>Resolved annotations / BotAnnotations</h4>
        <p>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="checkAllBotScopes">
            <font-awesome-icon :icon="['fas', 'list-check']" class="me-2" />
            Select all
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="labelExportSettings.botAnnotationMetadataIds = []"
          >
            <font-awesome-icon :icon="['fas', 'list-ul']" class="me-2" />
            Unselect all
          </button>
        </p>
        <ul class="list-group">
          <li v-for="scope in projectBotScopes" :key="scope.id" class="list-group-item">
            <input
              :id="`pbamd-${scope.id}`"
              :value="scope.id"
              v-model="labelExportSettings.botAnnotationMetadataIds"
              class="form-check-input me-1"
              type="checkbox"
            />
            <label :for="`pbamd-${scope.id}`" class="form-check-label stretched-link">
              {{ scope.name }}
            </label>
          </li>
        </ul>
      </div>

      <div class="col-lg-4">
        <h4>Labels</h4>
        <p>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" @click="checkAllLabels">
            <font-awesome-icon :icon="['fas', 'list-check']" class="me-2" />
            Select all
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="checkNoLabels">
            <font-awesome-icon :icon="['fas', 'list-ul']" class="me-2" />
            Unselect all
          </button>
        </p>
        <ul class="list-group">
          <li v-for="label in projectLabels" :key="label.key" class="list-group-item">
            <div class="d-flex">
              <div class="flex-grow-1">{{ label.key }}</div>
              <div v-if="!label.strings">
                <button
                  type="button"
                  class="btn btn-tiny btn-outline-secondary me-2"
                  @click="checkAllOptions(label.key)"
                >
                  <font-awesome-icon :icon="['fas', 'list-check']" class="me-1" />
                  all
                </button>
                <button type="button" class="btn btn-tiny btn-outline-secondary" @click="checkNoOptions(label.key)">
                  <font-awesome-icon :icon="['fas', 'list-ul']" class="me-1" />
                  none
                </button>
              </div>
              <div v-else>
                <input
                  :id="`lab-${label.key}_str`"
                  v-model="labelExportSettings.labels[label.key].strings"
                  class="form-check-input me-1"
                  type="checkbox"
                />
                <label :for="`lab-${label.key}_str`" class="form-check-label text-muted"> Include strings </label>
              </div>
            </div>
            <div class="row" v-if="!label.strings">
              <div class="col">
                <span
                  v-for="val in label.options_bool ?? label.options_int ?? label.options_multi"
                  :key="val"
                  class="me-2"
                >
                  <template v-if="label.options_bool">
                    <input
                      :id="`lab-${label.key}-${val}`"
                      :value="val"
                      v-model="labelExportSettings.labels[label.key].options_bool"
                      class="form-check-input me-1"
                      type="checkbox"
                    />
                  </template>
                  <template v-else-if="label.options_int">
                    <input
                      :id="`lab-${label.key}-${val}`"
                      :value="val"
                      v-model="labelExportSettings.labels[label.key].options_int"
                      class="form-check-input me-1"
                      type="checkbox"
                    />
                  </template>
                  <template v-else-if="label.options_multi">
                    <input
                      :id="`lab-${label.key}-${val}`"
                      :value="val"
                      v-model="labelExportSettings.labels[label.key].options_multi"
                      class="form-check-input me-1"
                      type="checkbox"
                    />
                  </template>
                  <label :for="`lab-${label.key}-${val}`" class="form-check-label text-muted">
                    {{ val }}
                  </label>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="row mt-5 mb-5">
      <div class="col-2 ms-auto text-end">
        <button type="button" class="btn btn-outline-secondary" @click="downloadAnnotations">
          <font-awesome-icon :icon="['fas', 'file-export']" />
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { LabelOptions, ProjectBaseInfoEntry, ProjectBaseInfoScopeEntry } from "@/plugins/api/types";
import NQLBox from "@/components/NQLBox.vue";
import { type Filter as NQLFilter } from "@/util/nql";
import { isEmpty } from "@/util";

export default defineComponent({
  name: "DatasetExportView",
  components: { NQLBox },
  data() {
    return {
      projectUsers: [] as Array<ProjectBaseInfoEntry>,
      projectScopes: [] as Array<ProjectBaseInfoScopeEntry>,
      projectBotScopes: [] as Array<ProjectBaseInfoEntry>,
      projectLabels: {} as Record<string, LabelOptions>,
      nqlQuery: "HAS ANNOTATION",
      labelExportSettings: {
        assignmentScopeIds: [] as Array<string>,
        botAnnotationMetadataIds: [] as Array<string>,
        userIds: [] as Array<string>,
        itemFields: [] as Array<string>,
        nqlFilter: null as null | NQLFilter,
        labels: {} as Record<string, LabelOptions>,
        ignoreHierarchy: true,
        ignoreOrder: true,
      },
    };
  },
  async mounted() {
    API.export
      .getExportBaseinfoApiExportProjectBaseinfoGet({
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
      .then((response) => {
        this.projectScopes = response.data.scopes;
        this.projectUsers = response.data.users;
        this.projectBotScopes = response.data.bot_scopes;
        this.projectLabels = response.data.labels;

        // pre-populate settings and deselect all
        this.labelExportSettings.labels = JSON.parse(JSON.stringify(response.data.labels));
        Object.keys(this.labelExportSettings.labels).forEach((key) => {
          this.checkNoOptions(key);
        });
      })
      .catch(toastReject);
  },
  methods: {
    downloadAnnotations() {
      const lValues: Array<LabelOptions> = Object.values(this.labelExportSettings.labels);
      const labels = lValues.map(
        (label: LabelOptions) =>
          ({
            key: label.key,
            options_int: !label.options_int || label.options_int.length === 0 ? undefined : label.options_int,
            options_bool: !label.options_bool || label.options_bool.length === 0 ? undefined : label.options_bool,
            options_multi: !label.options_multi || label.options_multi.length === 0 ? undefined : label.options_multi,
          }) as LabelOptions,
      );

      API.export
        .getAnnotationsCsvApiExportAnnotationsCsvPost({
          headers: { "x-project-id": currentProjectStore.projectId as string },
          body: {
            labels: labels,
            nql_filter: isEmpty(this.labelExportSettings.nqlFilter) ? null : this.labelExportSettings.nqlFilter[0],
            ignore_hierarchy: this.labelExportSettings.ignoreHierarchy,
            ignore_repeat: this.labelExportSettings.ignoreOrder,
            bot_annotation_metadata_ids: this.labelExportSettings.botAnnotationMetadataIds,
            assignment_scope_ids: this.labelExportSettings.assignmentScopeIds,
            user_ids: this.labelExportSettings.userIds,
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/csv" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "export.csv";
          link.click();
        })
        .catch(toastReject);
    },
    checkAllScopes() {
      this.labelExportSettings.assignmentScopeIds = this.projectScopes.map(
        (scope: ProjectBaseInfoScopeEntry) => scope.id,
      );
    },
    checkAllBotScopes() {
      this.labelExportSettings.botAnnotationMetadataIds = this.projectBotScopes.map(
        (scope: ProjectBaseInfoEntry) => scope.id,
      );
    },
    checkAllUsers() {
      this.labelExportSettings.userIds = this.projectUsers.map((user: ProjectBaseInfoEntry) => user.id);
    },
    checkAllLabels() {
      Object.keys(this.labelExportSettings.labels).forEach((key: string) => {
        this.checkAllOptions(key);
      });
    },
    checkNoLabels() {
      Object.keys(this.labelExportSettings.labels).forEach((key: string) => {
        this.checkNoOptions(key);
      });
    },
    checkAllOptions(key: string) {
      this.labelExportSettings.labels[key].options_multi = this.projectLabels[key].options_multi;
      this.labelExportSettings.labels[key].options_bool = this.projectLabels[key].options_bool;
      this.labelExportSettings.labels[key].options_int = this.projectLabels[key].options_int;
    },
    checkNoOptions(key: string) {
      this.labelExportSettings.labels[key].options_multi = [];
      this.labelExportSettings.labels[key].options_bool = [];
      this.labelExportSettings.labels[key].options_int = [];
    },
  },
  computed: {
    // pass
  },
});
</script>

<style scoped></style>
