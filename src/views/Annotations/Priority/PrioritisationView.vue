<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import SortedScopePicker from "@/components/annotations/SortedScopePicker.vue";
import ExpandableBox from "@/components/ExpandableBox.vue";
import { dt2str, pyDTNow, timestampNow, delay } from "@/util";
import NQLBox from "@/components/NQLBox.vue";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation.ts";
import { ToastEvent } from "@/plugins/events/events/toast.ts";
import { currentProjectStore, currentUserStore } from "@/stores";
import { API, toastReject, toastSuccess } from "@/plugins/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ClimateBERTModel, SciBERTModel, PriorityModel } from "@/plugins/api/spec";
import SortedTableHead from "@/components/SortableTable/SortedTableHead.vue";
import SortedTable from "@/components/SortableTable/SortedTable.vue";
import ItemModal from "@/components/items/ItemModal.vue";
import { useRoute } from "vue-router";
import ViewContainer from "@/components/ViewContainer.vue";

export type PeekRow = {
  scope_order: number;
  item_order: number;
  item_id: string;
  wos_id?: string | null;
  oa_id?: string | null;
  doi?: string | null;
  py?: number | null;
  config?: ClimateBERTModel | SciBERTModel;
} & Record<string, number>;

const route = useRoute();

const nql = ref<object[]>([]);
const focusItem = ref<string | null>(null);
const setup = ref<PriorityModel | null>(null);

const peekTable = ref<PeekRow[]>([]);
const peekTableExtraColumns = computed<string[]>(() =>
  peekTable.value.length === 0
    ? []
    : [
        ...new Set(Object.keys(peekTable.value[0])).difference(
          new Set(["scope_order", "item_order", "item_id", "wos_id", "oa_id", "doi", "py", setup.value.incl_field]),
        ),
      ],
);

async function peek() {
  peekTable.value = (
    await API.prio.getTableSampleApiPrioTablePeekPost({
      xProjectId: currentProjectStore.projectId as string,
      requestBody: {
        query: nql.value[0],
        scope_ids: setup.value.source_scopes,
        incl: setup.value.incl_rule,
      },
    })
  ).data;
}

async function apiSave() {
  if (!setup.value.time_created) {
    setup.value.time_created = pyDTNow();
  }
  await API.prio.savePrioSetupApiPrioSetupPut({
    xProjectId: currentProjectStore.projectId as string,
    requestBody: setup.value,
  });
}

async function train() {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "This is expensive. Really?",
      (response) => {
        if (response === "ACCEPT") {
          setup.value.time_started = pyDTNow();
          apiSave()
            .then(() => {
              // TODO: init training
            })
            .catch(toastReject);
        }
      },
      "Run model training and prediction",
      "Yes!",
      "oops, no.",
    ),
  );
}

function save() {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "You can save changes at any time for convenience (e.g. changing the name later). However, other changes after the model is started or data was retrieved may lead to inconsistent states. Only proceed if you know exactly what you are doing.",
      (response) => {
        if (response === "ACCEPT") {
          apiSave().then(toastSuccess("Saved")).catch(toastReject);
        } else {
          EventBus.emit(new ToastEvent("WARN", "Did not save."));
        }
      },
      "Save prioritisation run",
      "Yes, save!",
      "Nope!",
    ),
  );
}

onMounted(async () => {
  if (route.query.priority_id) {
    setup.value = (
      await API.prio.readPrioSetupApiPrioSetupGet({
        priorityId: route.query.priority_id,
        xProjectId: currentProjectStore.projectId as string,
      })
    ).data;
  }
  if (!setup.value) {
    setup.value = {
      priority_id: route.query.priority_id ?? crypto.randomUUID().toString(),
      project_id: currentProjectStore.projectId,
      name: `${timestampNow()}_round_??`,
      // scopes to use labels from
      source_scopes: [],
      // Filter for which items to use for prediction AND training (labels are not an outer join!)
      nql: "IS ASSIGNED",
      incl_rule: "res|rel:1", //"OR [mult:0 mult:2 mult:5]",
      incl_field: "incl",
      incl_pred_field: "pred|incl",
      train_split: 0.8,
      n_predictions: 1000,
      config: { conf: "CLIMBERT", n_epochs: 3 } as ClimateBERTModel,
    };
  }
});
</script>

<template>
  <ViewContainer title="Priority screening run" :ready="!!setup" icon="robot" load-text="Loading...">
    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="runInfoName" class="form-label">Run descriptor (name)</label>
          <input type="text" class="form-control" id="runInfoName" v-model="setup.name" />
        </div>
      </div>
      <div class="col-4">
        <div>
          <strong>Setup ID:</strong> <code>{{ setup.priority_id }}</code>
        </div>
        <div><strong>Setup created:</strong> {{ dt2str(setup.time_created) }}</div>
        <div><strong>Training started:</strong> {{ dt2str(setup.time_started) }}</div>
        <div><strong>Predictions ready:</strong> {{ dt2str(setup.time_ready) }}</div>
        <div><strong>Assignments done:</strong> {{ dt2str(setup.time_assigned) }}</div>
      </div>
      <div class="col-2 text-end">
        <button class="btn btn-success" @click="save">Save</button>
      </div>
    </div>

    <ExpandableBox class="mb-3" :initially-open="!setup.time_started">
      <template v-slot:head><strong>1) Training data sources and settings</strong></template>
      <template v-slot:body>
        <h6 class="mb-4">
          Training data will be selected from the following scopes in the order provided here. The order within each
          scope is based on the respective order of assignments. You can also select from a set of pre-configured
          machine learning models and tweak basic settings.
        </h6>
        <div class="row mb-4">
          <div class="col-lg-9 col-12">
            <SortedScopePicker v-model="setup.source_scopes" />
          </div>
          <div class="col-lg-3 col-12">
            <h5>Model settings</h5>
            <div class="mb-3">
              <label for="modConfKind" class="form-label">Model</label>
              <select v-model="setup.config.conf" class="form-select" id="modConfKind">
                <!-- <option value="SVM">SVM with TF-IDF</option> -->
                <option value="SCIBERT">SciBERT</option>
                <option value="CLIMBERT">ClimateBERT</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="modConfSplit" class="form-label">Proportion for training</label>
              <input
                type="number"
                class="form-control"
                id="modConfSplit"
                placeholder="0.7"
                min="0.1"
                max="0.9"
                step="0.01"
                v-model="setup.train_split"
              />
            </div>
            <div class="mb-3">
              <label for="modConfIter" class="form-label">Number of training passes</label>
              <input
                type="number"
                class="form-control"
                id="modConfIter"
                placeholder="3"
                v-model="setup.config.n_epochs"
              />
            </div>
            <div>
              <label for="modConfRet" class="form-label">Number of predictions to keep</label>
              <input
                type="number"
                class="form-control"
                id="modConfRet"
                placeholder="1000"
                v-model="setup.n_predictions"
              />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <h5>Inclusion rule</h5>
            <a
              href="https://apsis.mcc-berlin.net/nacsos-docs/user/annotation/priority/"
              target="_blank"
              class="link-secondary me-2"
              style="text-decoration: none"
              rel="noopener noreferrer"
            >
              <font-awesome-icon :icon="['fas', 'circle-question']" />
              Help
            </a>
            <textarea
              class="form-control text-muted"
              style="font-family: monospace"
              v-model="setup.incl_rule"
              rows="2"
            />
          </div>
          <div class="col">
            <h5>NQL filter <span class="text-muted">(leave empty to use all items in project)</span></h5>
            <NQLBox :query="setup.nql" @update:query-parsed="(nq) => (nql = nq)" :rows="2" />
          </div>
        </div>
      </template>
    </ExpandableBox>

    <ExpandableBox class="mb-3" :initially-open="!setup.time_started">
      <template v-slot:head><strong>2) Verify data</strong></template>
      <template v-slot:body>
        <button class="btn btn-outline-secondary" @click="peek">Preview table</button>
        <div v-if="peekTable.length > 0" class="w-100 overflow-x-scroll">
          <SortedTable :data="peekTable">
            <template v-slot:head>
              <tr>
                <SortedTableHead col-key="item_id">ID</SortedTableHead>
                <SortedTableHead col-key="scope_order">Scope order</SortedTableHead>
                <SortedTableHead col-key="item_order">Item order</SortedTableHead>
                <SortedTableHead col-key="py">PY</SortedTableHead>
                <SortedTableHead :col-key="setup.incl_field">{{ setup.incl_field }}</SortedTableHead>
                <SortedTableHead v-for="col in peekTableExtraColumns" :key="col" :col-key="col"
                  >{{ col }}
                </SortedTableHead>
              </tr>
            </template>
            <template v-slot:body="sortedRows">
              <tr v-for="row in sortedRows.sortedRows" :key="row.item_id">
                <td @click="focusItem = row.item_id" role="button" class="small">
                  <code>{{ row.item_id }}</code>
                </td>
                <td>{{ row.scope_order }}</td>
                <td>{{ row.item_order }}</td>
                <td>{{ row.py }}</td>
                <td
                  :class="{
                    'bg-success': row[setup.incl_field] === true,
                    'bg-danger-subtle': row[setup.incl_field] === false,
                  }"
                >
                  {{ row[setup.incl_field] }}
                </td>
                <td v-for="col in peekTableExtraColumns" :key="col">{{ row[col] }}</td>
              </tr>
            </template>
          </SortedTable>
        </div>
      </template>
    </ExpandableBox>

    <ExpandableBox class="mb-3">
      <template v-slot:head><strong>3) Prioritisation results</strong></template>
      <template v-slot:body>
        <template v-if="!setup.time_started">
          <button class="btn btn-outline-secondary" @click="train" v-if="currentUserStore.isSudo">
            <font-awesome-icon icon="robot" />
            Initiate training
          </button>
          <div v-else>Ask someone to initiate training.</div>
        </template>
        <template v-else-if="!setup.time_ready">
          <div class="callout callout-warning">
            <font-awesome-icon icon="stopwatch" />
            Please wait while the model is training
          </div>
        </template>
      </template>
    </ExpandableBox>
  </ViewContainer>

  <ItemModal :item-id="focusItem" @dismissed="focusItem = undefined" />
</template>

<style scoped></style>
