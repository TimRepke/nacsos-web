<template>
  <div>
    <div v-if="editMode">
      <div class="d-flex flex-row justify-content-end">
        <div class="p-2">
          <InlineToolTip info="Clear open resolutions" placement="right">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="clearOpen()">
              <font-awesome-icon :icon="['fas', 'broom']" />
            </button>
          </InlineToolTip>
        </div>
        <div class="p-2">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="assiEditMode" v-model="assiEditMode" />
            <label class="form-check-label" for="assiEditMode">Assignment edit mode</label>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-sm">
        <tbody>
          <tr v-for="(cnt, username) in shownUsernames" :key="username" :class="{ 'edit-mode': assiEditMode }">
            <th>
              {{ username }}
              <span class="fw-light text-muted small">({{ cnt }})</span>
              <inline-tool-tip v-show="assiEditMode" info="Assign all to user" placement="right" class="ms-2">
                <font-awesome-icon icon="user-tag" @click="assignAll(username)" class="clickable-icon" />
              </inline-tool-tip>
              <inline-tool-tip
                v-show="assiEditMode"
                info="Drop all open assignments for user"
                placement="right"
                class="ms-1"
              >
                <font-awesome-icon icon="user-xmark" @click="clearUser(username)" class="clickable-icon" />
              </inline-tool-tip>
            </th>
            <td
              v-for="(itemId, i) in itemIds"
              :key="itemId"
              :class="getBackgroundColourClass(username, itemId)"
              @click="editCell(username, itemId, i)"
            >
              <!--{{ this.tryGetAssignment(userId, itemId)?.status }}-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { PropType } from "vue";
import { AssignmentInfo, AssignmentScopeEntry } from "@/plugins/api/types";
import { API, toastReject, toastSuccess } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { ToastEvent } from "@/plugins/events/events/toast";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

type Indexed<T> = T & { index: number };

defineOptions({ name: "AssignmentsVisualiser" });

const props = defineProps({
  assignmentEntries: {
    type: Object as PropType<AssignmentScopeEntry[]>,
    default: (): AssignmentScopeEntry[] => [] as AssignmentScopeEntry[],
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  assignmentScopeId: {
    type: String,
    required: true,
  },
  annotationSchemeId: {
    type: String,
    required: true,
  },
});

currentProjectStore.users.ensureLoaded();

const assiEditMode = ref(false);
const entries = ref(JSON.parse(JSON.stringify(props.assignmentEntries)));

// re-sync the local copy when the parent refetches the assignment entries,
// otherwise the grid keeps rendering the one-time snapshot from mount
watch(
  () => props.assignmentEntries,
  (assignmentEntries: AssignmentScopeEntry[]) => {
    entries.value = JSON.parse(JSON.stringify(assignmentEntries));
  },
);

const assignedUsers = computed<Record<string, number>>(() => {
  const count: Record<string, number> = {};
  entries.value.forEach((entry: AssignmentScopeEntry) =>
    entry.assignments.forEach(
      (assignment: AssignmentInfo) => (count[assignment.username] = (count[assignment.username] ?? 0) + 1),
    ),
  );
  return count;
});
const shownUsernames = computed<Record<string, number>>(() => {
  if (assiEditMode.value) {
    return {
      ...Object.fromEntries(currentProjectStore.users.usernames.map((username) => [username, 0])),
      ...assignedUsers.value,
    };
  }
  return assignedUsers.value;
});
const itemIds = computed<Array<string>>(() => {
  return [...new Set(entries.value.map((entry: AssignmentScopeEntry) => entry.item_id))] as string[];
});
const lookup = computed<
  Record<string, Indexed<AssignmentScopeEntry> & { assignments: Record<string, Indexed<AssignmentInfo>> }>
>(() => {
  return Object.fromEntries(
    entries.value.map((entry: AssignmentScopeEntry, i: number) => [
      entry.item_id,
      {
        ...entry,
        index: i,
        assignments: Object.fromEntries(
          entry.assignments.map((assignment: AssignmentInfo, j: number) => [
            assignment.username,
            { ...assignment, index: j },
          ]),
        ),
      },
    ]),
  );
});

function getBackgroundColourClass(username: string, itemId: string): string[] {
  const assignment: (AssignmentInfo & { index: number }) | undefined = lookup.value[itemId]?.assignments[username];
  switch (assignment?.status) {
    case "OPEN":
      return ["table-info", "edit-droppable"];
    case "PARTIAL":
      return ["table-warning", "edit-fixed"];
    case "FULL":
      return ["table-success", "edit-fixed"];
    default:
      return ["edit-addable"];
  }
}
function clearOpen() {
  EventBus.emit(
    new ConfirmationRequestEvent(
      "Are you absolutely sure you want to delete all open assignments?",
      (confirmationResponse) => {
        if (confirmationResponse === "ACCEPT") {
          API.annotations
            .clearEmptyAssignmentsApiAnnotationsConfigScopesClearSchemeIdPost({
              query: { scope_id: props.assignmentScopeId },
              headers: { "x-project-id": currentProjectStore.projectId as string },
            })
            .then(() => {
              EventBus.emit(new ToastEvent("SUCCESS", "All open assignments cleared; reload page to see result!"));
            })
            .catch(toastReject);
        } else {
          EventBus.emit(new ToastEvent("WARN", "OK, did not do anything."));
        }
      },
      "Delete open assignments",
      "I understand, clear it!",
      "Cancel",
    ),
  );
}
function clearUser(username: string) {
  API.annotations
    .clearEmptyAssignmentsApiAnnotationsConfigScopesClearSchemeIdPost({
      query: { scope_id: props.assignmentScopeId, user_id: currentProjectStore.users.name2id[username] },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then(toastSuccess(`All open assignments for ${username} cleared; reload page (F5) to see result!`))
    .catch(toastReject);
}
function assignAll(username: string) {
  if (assiEditMode.value) {
    API.annotations
      .bulkAddAssignmentApiAnnotationsConfigScopesBulkAddPut({
        body: {
          item_ids: itemIds.value,
          scheme_id: props.annotationSchemeId,
          scope_id: props.assignmentScopeId,
          user_id: currentProjectStore.users.name2id[username],
        },
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
      .then(toastSuccess(`Bulk-created assignments for ${username}; reload page (F5) to see result!`))
      .catch(toastReject);
  }
}
function editCell(username: string, itemId: string, order: number) {
  if (assiEditMode.value) {
    const item = lookup.value[itemId];
    const assignment = item.assignments[username];
    if (!assignment || assignment.status === "OPEN") {
      API.annotations
        .editAssignmentApiAnnotationsConfigAssignmentsEditPut({
          body: {
            item_id: itemId,
            user_id: currentProjectStore.users.name2id[username],
            order,
            scheme_id: props.annotationSchemeId,
            scope_id: props.assignmentScopeId,
          },
          headers: { "x-project-id": currentProjectStore.projectId as string },
        })
        .then((res) => {
          if (assignment) {
            entries.value[item.index].assignments.splice(assignment.index, 1);
          } else {
            entries.value[item.index].assignments.push({
              user_id: res.data.user_id,
              username: currentProjectStore.users.id2name[res.data.user_id],
              order: res.data.order,
              assignment_id: res.data.assignment_id,
              status: res.data.status,
              labels: null,
            });
          }
        })
        .catch(toastReject);
    }
  }
}
</script>

<style>
.edit-mode > td.edit-droppable {
  cursor: context-menu;
}

.edit-mode > td.edit-addable {
  cursor: copy;
}

.edit-mode > td.edit-fixed {
  cursor: no-drop;
}
</style>
