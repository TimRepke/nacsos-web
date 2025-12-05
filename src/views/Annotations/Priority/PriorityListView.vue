<script setup lang="ts">
import { currentProjectStore } from "@/stores";
import SortedTable from "@/components/SortableTable/SortedTable.vue";
import SortedTableHead from "@/components/SortableTable/SortedTableHead.vue";
import { DehydratedPriorityModel } from "@/plugins/api/spec";
import { onMounted, ref } from "vue";
import { API, ignore, toastReject, toastSuccess } from "@/plugins/api";
import { dt2str } from "@/util";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";

const newId = crypto.randomUUID().toString();
const setups = ref<DehydratedPriorityModel[]>([]);

async function drop(priority: DehydratedPriorityModel) {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "Really?",
      (response) => {
        if (response === "ACCEPT") {
          API.prio
            .dropPrioSetupApiPrioSetupDelete({
              headers: { "x-project-id": currentProjectStore.projectId as string },
              query: { priority_id: priority.priority_id as string },
            })
            .then(() => {
              reload();
              toastSuccess("Deleted!")();
            })
            .catch(toastReject);
        }
      },
      `Delete ${priority.name}`,
      "Yes!",
      "oops, no.",
    ),
  );
}

async function clone(priority: DehydratedPriorityModel) {
  const cloned = (
    await API.prio.readPrioSetupApiPrioSetupGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      query: { priority_id: priority.priority_id as string },
    })
  ).data;
  if (!cloned) return;

  cloned.priority_id = crypto.randomUUID().toString();
  cloned.name = `Copy of ${cloned.name}`;
  delete cloned.prioritised_ids;
  delete cloned.time_created;
  delete cloned.time_started;
  delete cloned.time_ready;
  delete cloned.time_assigned;
  delete cloned.prioritised_ids;
  delete cloned.prioritised_ids;
  await API.prio.savePrioSetupApiPrioSetupPut({
    headers: { "x-project-id": currentProjectStore.projectId as string },
    body: cloned,
  });
}

function reload() {
  API.prio
    .readProjectSetupsApiPrioSetupsGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((res) => (setups.value = res.data))
    .catch(ignore);
}

onMounted(reload);
</script>

<template>
  <div>
    <h1>Priority screening setups</h1>
    <div class="mb-3 row g-0">
      <div class="col text-end">
        <router-link
          role="button"
          class="btn btn-outline-secondary btn-sm"
          :to="{ name: 'config-priority-setup', query: { priority_id: newId } }"
        >
          <font-awesome-icon :icon="['far', 'square-plus']" />
          New prioritisation setup
        </router-link>
      </div>
    </div>
    <SortedTable :data="setups">
      <template v-slot:head>
        <tr>
          <SortedTableHead col-key="name">Name</SortedTableHead>
          <SortedTableHead col-key="time_created">Time created</SortedTableHead>
          <SortedTableHead col-key="time_started">Time training</SortedTableHead>
          <SortedTableHead col-key="time_ready">Time ready</SortedTableHead>
          <th></th>
        </tr>
      </template>
      <template v-slot:body="sortedRows">
        <tr v-for="row in sortedRows.sortedRows" :key="row.priority_id">
          <router-link
            :to="{
              name: 'config-priority-setup',
              query: { priority_id: row.priority_id },
            }"
            custom
            v-slot="{ navigate }"
          >
            <td @click.stop="navigate" role="button">{{ row.name }}</td>
            <td>{{ dt2str(row.time_created) }}</td>
            <td>{{ dt2str(row.time_started) }}</td>
            <td>{{ dt2str(row.time_ready) }}</td>
            <td class="text-end">
              <font-awesome-icon icon="copy" class="clickable-icon me-2" @click="clone(row)" />
              <font-awesome-icon icon="trash" class="clickable-icon me-2" @click="drop(row)" />
            </td>
          </router-link>
        </tr>
      </template>
    </SortedTable>
  </div>
</template>

<style scoped></style>
