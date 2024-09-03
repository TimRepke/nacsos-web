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
          <tr v-for="username in shownUsernames" :key="username" :class="{ 'edit-mode': assiEditMode }">
            <th>{{ username }}</th>
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

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { AssignmentInfo, AssignmentScopeEntry } from "@/plugins/api/types";
import { API, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { ToastEvent } from "@/plugins/events/events/toast";
import InlineToolTip from "@/components/InlineToolTip.vue";

type Indexed<T> = T & { index: number };

export default defineComponent({
  name: "AssignmentsVisualiser",
  components: { InlineToolTip },
  props: {
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
  },
  data() {
    currentProjectStore.projectUsers.ensureLoaded();

    return {
      assiEditMode: false,
      entries: JSON.parse(JSON.stringify(this.assignmentEntries)),
    };
  },
  computed: {
    assignedUsers(): Array<string> {
      return [
        ...new Set(
          this.entries.flatMap((entry: AssignmentScopeEntry) =>
            entry.assignments.map((assignment: AssignmentInfo) => assignment.username),
          ),
        ),
      ] as string[];
    },
    shownUsernames(): Array<string> {
      if (this.assiEditMode) {
        return currentProjectStore.projectUsers.usernames;
      }
      return this.assignedUsers;
    },
    itemIds(): Array<string> {
      return [...new Set(this.entries.map((entry: AssignmentScopeEntry) => entry.item_id))] as string[];
    },
    lookup(): Record<string, Indexed<AssignmentScopeEntry> & { assignments: Record<string, Indexed<AssignmentInfo>> }> {
      return Object.fromEntries(
        this.entries.map((entry: AssignmentScopeEntry, i: number) => [
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
    },
  },
  methods: {
    getBackgroundColourClass(username: string, itemId: string): string[] {
      const assignment: (AssignmentInfo & { index: number }) | undefined = this.lookup[itemId]?.assignments[username];
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
    },
    clearOpen() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Are you absolutely sure you want to delete all open assignments?",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.annotations
                .clearEmptyAssignmentsApiAnnotationsConfigScopesClearSchemeIdPost({
                  scopeId: this.assignmentScopeId,
                  xProjectId: currentProjectStore.projectId as string,
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
    },
    editCell(username: string, itemId: string, order: number) {
      if (this.assiEditMode) {
        const item = this.lookup[itemId];
        const assignment = item.assignments[username];
        if (!assignment || assignment.status === "OPEN") {
          API.annotations
            .editAssignmentApiAnnotationsConfigAssignmentsEditPut({
              requestBody: {
                item_id: itemId,
                user_id: currentProjectStore.projectUsers.name2id[username],
                order,
                scheme_id: this.annotationSchemeId,
                scope_id: this.assignmentScopeId,
              },
              xProjectId: currentProjectStore.projectId as string,
            })
            .then((res) => {
              if (assignment) {
                this.entries[item.index].assignments.splice(assignment.index, 1);
              } else {
                this.entries[item.index].assignments.push({
                  user_id: res.data.user_id,
                  username: currentProjectStore.projectUsers.id2name[res.data.user_id],
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
    },
  },
});
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
