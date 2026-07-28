<template>
  <div>
    <h1>Download/Export Data</h1>

    <div class="row gy-4 gx-5">
      <div class="col-lg-7">
        <h4>NQL item filter</h4>
        <n-q-l-box
          :query="nqlQuery"
          @update:query-parsed="(newFilter: NQLFilter) => (labelExportSettings.nqlFilter = newFilter)"
        />
      </div>

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
            <div class="mt-3">
              <label for="export-format" class="form-label">
                Export format
                <select class="form-select form-select" id="export-format" v-model="selectedFormat">
                  <option v-for="(info, key) in FORMATS" :key="key" :value="key">{{ info.name }}</option>
                </select>
              </label>
            </div>
            <div class="mt-3">
              <h6>Columns to drop</h6>
              <input id="cte-me" type="checkbox" value="meta" v-model="labelExportSettings.columnsToDrop" />
              <label for="cte-me" class="ms-1">meta</label>
              <input
                id="cte-ar"
                class="ms-2"
                type="checkbox"
                value="authors_raw"
                v-model="labelExportSettings.columnsToDrop"
              />
              <label for="cte-ar" class="ms-1">authors_raw</label>
              <input
                id="cte-kw"
                class="ms-2"
                type="checkbox"
                value="keywords"
                v-model="labelExportSettings.columnsToDrop"
              />
              <label for="cte-kw" class="ms-1">keywords</label>
            </div>
          </div>
        </div>
      </div>

      <div class="col-2 ms-auto text-end d-flex flex-column justify-content-end">
        <DebounceButton class="btn btn-outline-secondary" :onClick="downloadAnnotations" :timeout="30000">
          <font-awesome-icon :icon="['fas', 'file-export']" />
          Download
        </DebounceButton>
      </div>

      <div class="col-lg-12">
        <div class="row">
          <div class="col">
            <h4>Annotations</h4>
            <label for="export-format" class="form-label">
              Annotation scheme
              <select
                class="form-select form-select"
                id="export-format"
                v-model="selectedScheme"
                @change="schemeChanged"
              >
                <option v-for="(scheme, schemeId) in schemes" :key="schemeId" :value="scheme.id">
                  {{ scheme.name }}
                </option>
              </select>
            </label>
          </div>
        </div>
        <div class="row" v-if="selectedScheme in schemes">
          <div class="col-6">
            <p>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary me-2"
                @click="
                  labelExportSettings.assignmentScopeIds = schemes[selectedScheme].scopes.map((scope) => scope.id)
                "
              >
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
              <li v-for="scope in schemes[selectedScheme].scopes" :key="scope.id" class="list-group-item">
                <input
                  :id="`pu-${scope.id}`"
                  :value="scope.id"
                  v-model="labelExportSettings.assignmentScopeIds"
                  class="form-check-input me-1"
                  type="checkbox"
                />
                <label :for="`pu-${scope.id}`" class="form-check-label stretched-link ms-2">
                  {{ scope.name }}
                </label>
              </li>
            </ul>
          </div>

          <div class="col-6">
            <p>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary me-2"
                @click="
                  labelExportSettings.botAnnotationMetadataIds = schemes[selectedScheme].resolutions.map(
                    (scope) => scope.id,
                  )
                "
              >
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
              <li v-for="scope in schemes[selectedScheme].resolutions" :key="scope.id" class="list-group-item">
                <input
                  :id="`pu-${scope.id}`"
                  :value="scope.id"
                  v-model="labelExportSettings.botAnnotationMetadataIds"
                  class="form-check-input me-1"
                  type="checkbox"
                />
                <label :for="`pu-${scope.id}`" class="form-check-label stretched-link ms-2">
                  {{ scope.name }}
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { API, ApiResponseReject, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { LabelOptions, BaseInfoWithScheme, BaseInfo } from "@/plugins/api/types";
import NQLBox from "@/components/NQLBox.vue";
import { type Filter, type Filter as NQLFilter } from "@/util/nql";
import { isEmpty } from "@/util";
import DebounceButton from "@/components/DebounceButton.vue";

const FORMATS: Record<string, { type: string; name: string }> = {
  csv: { type: "application/csv", name: "CSV (recommended)" },
  jsonl: { type: "text/plain", name: "JSONl" },
  ris: { type: "application/x-research-info-systems", name: "RIS (zotero compatible)" },
  excel: { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name: "Excel" },
};

interface Scheme {
  id: string;
  name: string;
  scopes: Array<BaseInfoWithScheme>;
  resolutions: Array<BaseInfoWithScheme>;
}
const projectUsers = ref<Array<BaseInfo>>([]);
const projectScopes = ref<Array<BaseInfoWithScheme>>([]);
const projectBotScopes = ref<Array<BaseInfoWithScheme>>([]);
const projectLabels = ref<Record<string, LabelOptions>>({});

const nqlQuery = ref("HAS ANNOTATION");

const selectedFormat = ref<string>("csv");
const selectedScheme = ref<string>("");

const projectUserIds = computed(() => projectUsers.value.map((user) => user.id));
const schemes = computed(() => {
  const ret: Record<string, Scheme> = {};
  projectScopes.value.forEach((scope) => {
    if (!(scope.scheme_id in ret)) {
      ret[scope.scheme_id] = {
        id: scope.scheme_id,
        name: scope.scheme_name,
        scopes: [],
        resolutions: [],
      };
    }
    ret[scope.scheme_id].scopes.push(scope);
  });
  projectBotScopes.value.forEach((scope) => {
    if (!(scope.scheme_id in ret)) {
      ret[scope.scheme_id] = {
        id: scope.scheme_id,
        name: scope.scheme_name,
        scopes: [],
        resolutions: [],
      };
    }
    ret[scope.scheme_id].resolutions.push(scope);
  });
  return ret;
});

const labelExportSettings = reactive({
  assignmentScopeIds: [] as Array<string>,
  botAnnotationMetadataIds: [] as Array<string>,
  userIds: [] as Array<string>,
  itemFields: [] as Array<string>,
  nqlFilter: [] as Filter[],
  labels: {} as Record<string, LabelOptions>,
  ignoreHierarchy: true,
  ignoreOrder: true,
  columnsToDrop: ["type", "time_edited", "project_id", "title_slug", "keywords", "meta", "authors_raw"],
});

onMounted(async () => {
  try {
    const response = await API.export.getExportBaseinfoApiExportProjectBaseinfoGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    });
    projectScopes.value = response.data.scopes;
    projectUsers.value = response.data.users;
    projectBotScopes.value = response.data.bot_scopes;
  } catch (e) {
    toastReject(e as ApiResponseReject);
  }
});

const schemeChanged = () => {
  labelExportSettings.assignmentScopeIds = schemes.value[selectedScheme.value].scopes.map((scope) => scope.id);
  labelExportSettings.botAnnotationMetadataIds = schemes.value[selectedScheme.value].resolutions.map(
    (scope) => scope.id,
  );
  API.export
    .getExportLabelOptionsApiExportProjectLabelOptionsSchemeIdGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      path: { scheme_id: selectedScheme.value },
    })
    .then((response) => {
      projectLabels.value = response.data;
      labelExportSettings.labels = response.data;
    })
    .catch(toastReject);
};

const downloadAnnotations = () => {
  const lValues: Array<LabelOptions> = Object.values(labelExportSettings.labels);
  const labels = lValues.map(
    (label: LabelOptions) =>
      ({
        key: label.key,
        options_int: !label.options_int || label.options_int.length === 0 ? undefined : label.options_int,
        options_bool: !label.options_bool || label.options_bool.length === 0 ? undefined : label.options_bool,
        options_multi: !label.options_multi || label.options_multi.length === 0 ? undefined : label.options_multi,
      }) as LabelOptions,
  );
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  API.export
    .exportAnnotationsApiExportAnnotationsExportFormatPost({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      path: {
        export_format: selectedFormat.value,
      },
      body: {
        labels: labels,
        nql_filter: isEmpty(labelExportSettings.nqlFilter) ? null : labelExportSettings.nqlFilter[0],
        ignore_hierarchy: labelExportSettings.ignoreHierarchy,
        ignore_repeat: labelExportSettings.ignoreOrder,
        bot_annotation_metadata_ids: labelExportSettings.botAnnotationMetadataIds,
        assignment_scope_ids: labelExportSettings.assignmentScopeIds,
        user_ids: projectUserIds.value,
        columns_to_drop: labelExportSettings.columnsToDrop,
      },
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: FORMATS[selectedFormat.value].type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `export_${dateStr}.${selectedFormat.value}`;
      link.click();
    })
    .catch(toastReject);
};
</script>

<style scoped></style>
