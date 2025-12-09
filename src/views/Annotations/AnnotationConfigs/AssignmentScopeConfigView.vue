<script setup lang="ts">
import { currentProjectStore } from "@/stores";
import {
  AssignmentConfigLegacy,
  AssignmentConfigPriority,
  AssignmentConfigRandom,
  AssignmentCounts,
  AssignmentScopeModel,
  DehydratedPriorityModel,
} from "@/plugins/api/spec";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { API, logReject, toastReject, toastSuccess } from "@/plugins/api";
import { dt2str, pyDTNow, sum, timestampNow } from "@/util";
import ViewContainer from "@/components/ViewContainer.vue";
import NQLBox from "@/components/NQLBox.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ExpandableBox from "@/components/ExpandableBox.vue";
import ScopeQuality from "@/components/annotations/ScopeQuality.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";

enum Plausibility {
  OK,
  USER_POOL,
  ITEM_POOL,
  ERROR,
}

function isValid(
  conf: AssignmentConfigRandom | AssignmentConfigPriority | AssignmentConfigLegacy | null | undefined,
): conf is AssignmentConfigRandom | AssignmentConfigPriority {
  if (!conf) return false;
  return conf.config_type === "RANDOM" || conf.config_type === "PRIORITY";
}

const route = useRoute();
const router = useRouter();

const config = ref<AssignmentScopeModel | null>(null);
const counts = ref<AssignmentCounts | null>(null);
const priorities = ref<DehydratedPriorityModel[]>([]);
const overlapper = ref<number>(1);

const isEditable = computed<boolean>(() => !counts.value || counts.value.num_total <= 0);

const numAssignedItems = computed<number>(() =>
  isValid(config.value?.config) ? sum(Object.values(config.value.config.overlaps ?? {})) : 0,
);
const numAvailableAssignments = computed<number>(() =>
  isValid(config.value?.config) ? sum(Object.values(config.value.config.users ?? {})) : 0,
);
const numRequiredAssignments = computed<number>(() =>
  isValid(config.value?.config)
    ? Object.entries(config.value.config.overlaps ?? {}).reduce(
        (acc, entry) => acc + (parseInt(entry[0]) ?? 0) * entry[1],
        0,
      )
    : 0,
);
const numAssignmentDifference = computed<number>(() => numAvailableAssignments.value - numRequiredAssignments.value);
const assignmentPlausible = computed<Plausibility>(() => {
  const conf = config.value?.config;
  if (!isValid(conf)) return Plausibility.ERROR;
  let itemPool = numAssignedItems.value;
  let userPool = Object.entries(conf.users ?? {}).map((entry) => ({ user: entry[0], budget: entry[1] }));

  let overlap: number;
  let userIndex: number;
  for (const [ol, count] of Object.entries(conf.overlaps ?? {})) {
    overlap = parseInt(ol);
    // Configuration impossible, item pool ran out early!
    if (itemPool < count) return Plausibility.ITEM_POOL;
    if (count == 0 || overlap == 0) continue;

    for (let i = 0; i < count; i++) {
      // Configuration impossible, user pool ran out early
      if (userPool.length < overlap) return Plausibility.USER_POOL;
      for (let j = 0; j < overlap; j++) {
        userIndex = (i + j) % userPool.length;
        userPool[userIndex].budget -= 1;
        userPool = userPool.filter((usr) => usr.budget > 0);
        userPool.sort((u1, u2) => u1.budget - u2.budget);
      }
    }
    itemPool -= count;
  }
  return Plausibility.OK;
});
const availablePrioritisedItems = computed<Record<string, number>>(() =>
  Object.fromEntries(priorities.value.map((prio) => [prio.priority_id, prio.num_prioritised])),
);

onMounted(async () => {
  if (route.params.scope_id) {
    config.value = (
      await API.annotations.getAssignmentScopeApiAnnotationsAssignmentsScopeAssignmentScopeIdGet({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        path: { assignment_scope_id: route.params.scope_id as string },
      })
    ).data;
  }
  if (config.value) {
    await loadCounts();
  } else {
    config.value = {
      assignment_scope_id: (route.params.scope_id as string | undefined) || crypto.randomUUID().toString(),
      annotation_scheme_id: route.query.annotation_scheme_id as string,
      name: `${timestampNow()}_round_??`,
      description: "",
      config: null,
    };
  }
  await currentProjectStore.users.awaitLoaded();
  config.value!.config = {
    ...{
      config_type: "RANDOM",
      users: Object.fromEntries(currentProjectStore.users.userIds.map((uid) => [uid, 0])),
      overlaps: {
        1: 10,
        2: 10,
      },
      nql: "",
      nql_parsed: null,
      random_seed: 1337,
      prio_offset: 0,
      priority_id: null,
    },
    ...config.value?.config,
  };
  priorities.value = (
    await API.prio.readProjectSetupsApiPrioSetupsGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
  ).data;
});

async function loadCounts() {
  counts.value = (
    await API.annotations.getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      path: { assignment_scope_id: route.params.scope_id as string },
    })
  ).data;
}

async function sendReminders() {
  EventBus.emit(new ToastEvent("INFO", "Please only click the button once. Sending emails may take a while."));
  API.mailing
    .remindUsersAssigmentApiMailAssignmentReminderPost({
      query: { assignment_scope_id: config.value?.assignment_scope_id as string },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      EventBus.emit(new ToastEvent("SUCCESS", `Sent emails to ${response.data}`));
    })
    .catch(logReject);
}

function save() {
  API.annotations
    .putAssignmentScopeApiAnnotationsAssignmentsScopePut({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      body: config.value as AssignmentScopeModel,
    })
    .then(() => {
      toastSuccess("Saved assignment scope details!")();
      router.push({ name: route.name, params: { scope_id: config.value?.assignment_scope_id } });
      config.value!.time_created = pyDTNow();
    })
    .catch(toastReject);
}

function makeAssignments() {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "Once you create and send out assignments, you cannot make any further changes.\n\n" +
        "Are you sure you want to proceed?",
      (response) => {
        if (response === "ACCEPT" && config.value) {
          counts.value = { num_full: 0, num_open: 1, num_partial: 0, num_total: 1 };
          API.annotations
            .makeAssignmentsApiAnnotationsConfigAssignmentsAssignmentScopeIdPut({
              headers: { "x-project-id": currentProjectStore.projectId as string },
              path: { assignment_scope_id: config.value?.assignment_scope_id as string },
            })
            .then(() => {
              toastSuccess(`Successfully created assignments.`)();
              loadCounts().then().catch();
            })
            .catch((reason) => {
              toastReject(reason);
              counts.value = null;
            });
        }
      },
      "Create assignments",
    ),
  );
}
</script>

<template>
  <ViewContainer
    title="Annotation job assignments"
    :ready="!!config"
    :icon="['fas', 'rectangle-list']"
    load-text="Loading..."
  >
    <template v-if="config">
      <div class="row mb-3">
        <div class="col-7">
          <div class="mb-3">
            <label for="scopeName" class="form-label">Assignment scope title</label>
            <input type="text" class="form-control" id="scopeName" v-model="config.name" />
          </div>
          <div class="mb-3">
            <label for="scopeDescription" class="form-label">Scope description</label>
            <textarea class="form-control" id="scopeDescription" rows="3" v-model="config.description" />
          </div>
        </div>
        <div class="col-5">
          <div class="text-end">
            <button class="btn btn-success" @click="save">Save</button>
          </div>
          <div>
            <strong>Scope ID:</strong> <code>{{ config.assignment_scope_id }}</code>
          </div>
          <div>
            <strong>Scheme ID:</strong> <code>{{ config.annotation_scheme_id }}</code>
          </div>
          <div><strong>Scope created:</strong> {{ dt2str(config.time_created) }}</div>
          <template v-if="counts">
            <div><strong>Number of assignments:</strong> {{ counts.num_total }}</div>
            <div><strong>Number of open assignments:</strong> {{ counts.num_open }}</div>
            <div><strong>Number of partial assignments:</strong> {{ counts.num_partial }}</div>
            <div><strong>Number of done assignments:</strong> {{ counts.num_full }}</div>
          </template>
        </div>
      </div>

      <ExpandableBox :initially-open="isEditable" class="mb-3" v-if="config">
        <template v-slot:head><strong>Assignment settings</strong></template>
        <template v-slot:body>
          <template v-if="!config.config">Missing config.</template>
          <template v-else-if="!isValid(config.config)">
            This type of configuration is not supported anymore. In case it is important to you, we will try to keep the
            settings at least and show them to you.
            <pre><code>{{ config.config }}</code></pre>
          </template>
          <div v-else class="row g-6 position-relative">
            <button
              v-if="isEditable && config.time_created"
              class="btn btn-outline-secondary btn-sm"
              style="position: absolute; top: 0; right: 0.875em; width: 10em"
              @click="makeAssignments"
            >
              Make assignments
            </button>
            <div class="col-md-3 col-12 pe-5">
              <h5>Number of assignments per user</h5>
              <div v-for="(cnt, user) in config.config.users" :key="user" class="row mb-2">
                <div class="fw-bold col-8" :class="{ 'bg-success-subtle': cnt > 0 }" style="line-height: 2em">
                  {{ currentProjectStore.users.id2name[user] }}
                </div>
                <div class="col-4">
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    aria-label="Number of assignments"
                    v-model="config.config.users[user]"
                    :disabled="!isEditable"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-3 col-12 pe-5">
              <h5>Assignment overlap</h5>
              <div class="row mb-2 border-bottom">
                <ul class="list-unstyled mb-1">
                  <li>Assigned items: {{ numAssignedItems }}</li>
                  <li>Available assignments: {{ numAvailableAssignments }}</li>
                  <li>Required assignments: {{ numRequiredAssignments }}</li>
                  <li>
                    Difference:
                    <strong
                      :class="{
                        'bg-success-subtle': numAssignmentDifference === 0,
                        'bg-danger-subtle': numAssignmentDifference !== 0,
                      }"
                    >
                      {{ numAssignmentDifference }}
                    </strong>
                  </li>
                  <li>
                    Plausible:
                    <strong v-if="assignmentPlausible == Plausibility.OK" class="bg-success-subtle">OK!</strong>
                    <strong v-else-if="assignmentPlausible == Plausibility.ITEM_POOL" class="bg-warning-subtle">
                      User pool too large (ok)
                    </strong>
                    <strong v-else-if="assignmentPlausible == Plausibility.USER_POOL" class="bg-danger-subtle">
                      User pool ran out!
                    </strong>
                    <strong v-else class="bg-danger-subtle">NO!</strong>
                  </li>
                </ul>
              </div>
              <div v-for="(cnt, overlap) in config.config.overlaps" :key="overlap" class="row mb-2">
                <div class="col-4">
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    aria-label="Overlap"
                    v-model="config.config.overlaps[overlap]"
                    :disabled="!isEditable"
                  />
                </div>
                <div class="col-8 d-flex" style="line-height: 2em">
                  <span class="me-auto">
                    assigned to <strong>{{ overlap }}</strong> user(s)
                  </span>
                  <span>
                    <font-awesome-icon
                      :icon="['fas', 'trash']"
                      class="clickable-icon"
                      @click="delete config.config.overlaps[overlap]"
                    />
                  </span>
                </div>
              </div>
              <div class="row mt-2 pt-2 border-top">
                <div class="col">
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    aria-label="Overlap"
                    v-model="overlapper"
                    :disabled="!isEditable"
                  />
                </div>
                <div class="col">
                  <button
                    class="btn btn-outline-secondary btn-sm"
                    @click="config.config.overlaps[overlapper] = 10"
                    :disabled="!isEditable"
                  >
                    <font-awesome-icon :icon="['far', 'square-plus']" />
                    Add setting
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12">
              <h5>Data filter</h5>
              <div class="row mb-3">
                <div class="col">
                  <div class="btn-group btn-group-sm" role="group" aria-label="Filter type">
                    <input
                      type="radio"
                      class="btn-check"
                      name="filterType"
                      id="filterTypeRand"
                      autocomplete="off"
                      v-model="config.config.config_type"
                      value="RANDOM"
                      :disabled="!isEditable"
                    />
                    <label class="btn btn-outline-secondary" for="filterTypeRand">Random sampling</label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="filterType"
                      id="filterTypePrio"
                      autocomplete="off"
                      v-model="config.config.config_type"
                      value="PRIORITY"
                      :disabled="!isEditable"
                    />
                    <label class="btn btn-outline-secondary" for="filterTypePrio">Prioritised sampling</label>
                  </div>
                </div>
              </div>

              <template v-if="config.config.config_type === 'PRIORITY'">
                <div class="row mb-3">
                  <div class="col">
                    <label for="prioritySetup">Prioritised items</label>
                    <select v-model="config.config.priority_id" class="form-control" :disabled="!isEditable">
                      <template v-for="prio in priorities" :key="prio.priority_id">
                        <option :value="prio.priority_id" v-if="(prio.num_prioritised ?? 0) >= numAssignedItems">
                          {{ prio.name }}
                        </option>
                      </template>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <label for="priorityOffset">Offset</label>
                    <input
                      type="number"
                      id="priorityOffset"
                      v-model="config.config.prio_offset"
                      class="form-control"
                      :disabled="!isEditable"
                    />
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <template v-if="!config.config.priority_id"> Please select item prioritisation setup!</template>
                    <template v-else>
                      The selected setup stored
                      <strong>{{ availablePrioritisedItems[config.config.priority_id] }}</strong> prioritised items.
                      Going to use the first <strong>{{ numAssignedItems }}</strong> items in the ranking, starting at
                      position <strong>{{ config.config.prio_offset }}</strong> until
                      <strong>{{ config.config.prio_offset + numAssignedItems }}</strong
                      >. Make sure the offset leaves enough items in the ranking!
                    </template>
                  </div>
                </div>
              </template>

              <template v-else-if="config.config.config_type === 'RANDOM'">
                <div class="row mb-3">
                  <div class="col">
                    <NQLBox
                      :query="config.config.nql"
                      @update:query-parsed="(nq) => (config.config.nql_parsed = nq[0] ?? null)"
                      @update:query="(nq) => (config!.config!.nql = nq)"
                      :rows="4"
                      :editable="isEditable"
                    />
                  </div>
                </div>
              </template>

              <div class="row">
                <div class="col">
                  <label for="randomSeed">Random seed</label>
                  <input
                    type="number"
                    id="randomSeed"
                    v-model="config.config.random_seed"
                    class="form-control"
                    :disabled="!isEditable"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </ExpandableBox>

      <div class="row pb-2 mb-2 border-bottom g-0" v-if="!isEditable">
        <div class="col">
          <h4>Results</h4>
          <div class="text-end">
            <button type="button" class="btn btn-outline-warning" @click="sendReminders">
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
              Remind users per email
            </button>
          </div>
          <ScopeQuality :users="currentProjectStore.users.id2user" :scope="config" :edit-mode="true" />
        </div>
      </div>
    </template>
  </ViewContainer>
</template>
