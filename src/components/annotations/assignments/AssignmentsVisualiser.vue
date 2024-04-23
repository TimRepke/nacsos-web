<template>
  <div>
    <div class="table-responsive">
      <table class="table table-bordered table-sm">
        <tbody>
          <tr v-for="username in usernames" :key="username">
            <th>{{ username }}</th>
            <td v-for="itemId in itemIds" :key="itemId" :class="getBackgroundColourClass(username, itemId)">
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
import type { AssignmentInfo, AssignmentScopeEntry } from "@/plugins/api/types";

type User = { user_id: string; username: string };
export default defineComponent({
  name: "AssignmentsVisualiser",
  props: {
    assignmentEntries: {
      type: Object as PropType<AssignmentScopeEntry[]>,
      default: (): AssignmentScopeEntry[] => [] as AssignmentScopeEntry[],
    },
  },
  data() {
    return {};
  },
  computed: {
    users(): Array<User> {
      return [
        ...new Set(
          this.assignmentEntries.flatMap((entry: AssignmentScopeEntry) =>
            entry.assignments.map((assignment: AssignmentInfo) => ({
              user_id: assignment.user_id,
              username: assignment.username,
            })),
          ),
        ),
      ] as User[];
    },
    usernames(): Array<string> {
      return [
        ...new Set(
          this.assignmentEntries.flatMap((entry: AssignmentScopeEntry) =>
            entry.assignments.map((assignment: AssignmentInfo) => assignment.username),
          ),
        ),
      ] as string[];
    },
    itemIds(): Array<string> {
      return [...new Set(this.assignmentEntries.map((entry: AssignmentScopeEntry) => entry.item_id))] as string[];
    },
    lookup() {
      return Object.fromEntries(
        this.assignmentEntries.map((entry: AssignmentScopeEntry) => [
          entry.item_id,
          {
            ...entry,
            assignments: Object.fromEntries(
              entry.assignments.map((assignment: AssignmentInfo) => [assignment.username, assignment]),
            ),
          },
        ]),
      );
    },
  },
  methods: {
    getBackgroundColourClass(username: string, itemId: string): string[] {
      const assignment = this.lookup[itemId].assignments[username];
      switch (assignment?.status) {
        case "OPEN":
          return ["table-info"];
        case "PARTIAL":
          return ["table-warning"];
        case "FULL":
          return ["table-success"];
        default:
          return [];
      }
    },
  },
});
</script>

<style scoped></style>
