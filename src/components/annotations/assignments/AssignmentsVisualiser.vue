<template>
  <div>
    <div class="table-responsive ">
      <table class="table table-bordered">
        <tbody>
          <tr v-for="userId in userIds" :key="userId">
            <th>{{ userLookup[userId]?.username }}</th>
            <td
              v-for="itemId in itemIds"
              :key="itemId"
              :class="getBackgroundColourClass(userId, itemId)">
              <!--{{ this.tryGetAssignment(userId, itemId)?.status }}-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">

import type { PropType } from 'vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import type { AssignmentModel, UserModel } from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import { currentProjectStore } from '@/stores';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AssignmentsVisualiser',
  props: {
    assignments: {
      type: Object as PropType<AssignmentModel[]>,
      default: (): AssignmentModel[] => [] as AssignmentModel[],
    },
  },
  async mounted() {
    this.fetchUserInfos();
  },
  data() {
    return {
      users: [] as UserModel[],
    };
  },
  computed: {
    lookup(): Record<string, AssignmentModel[]> {
      const ret = this.itemIds.reduce((acc: { [key: string]: AssignmentModel[] }, itemId: string) => {
        acc[itemId] = [];
        return acc;
      }, {});
      this.assignments.forEach((assignment: AssignmentModel) => {
        ret[assignment.item_id].push(assignment);
      });
      return ret;
    },
    userIds(): Array<string> {
      return [...new Set(this.assignments.map((assignment: AssignmentModel) => assignment.user_id))] as string[];
    },
    itemIds(): Array<string> {
      return [...new Set(this.assignments.map((assignment: AssignmentModel) => assignment.item_id))] as string[];
    },
    userLookup(): Record<string, UserModel> {
      return this.users.reduce((acc: { [key: string]: UserModel }, user: UserModel) => {
        acc[user.user_id as string] = user;
        return acc;
      }, {});
    },
  },
  watch: {
    async userIds() {
      this.fetchUserInfos();
    },
  },
  methods: {
    fetchUserInfos() {
      API.core.users.getUsersByIdsApiUsersDetailsGet({
        xProjectId: currentProjectStore.projectId as string,
        userId: this.userIds,
      })
        .then((result) => { this.users = result.data; })
        .catch(() => { EventBus.emit(new ToastEvent('WARN', 'Failed to load usernames')); });
    },
    tryGetAssignment(userId: string, itemId: string): AssignmentModel | undefined {
      return this.lookup[itemId]?.find((assignment: AssignmentModel) => assignment.user_id === userId);
    },
    getBackgroundColourClass(userId: string, itemId: string): string[] {
      const assignment = this.tryGetAssignment(userId, itemId);
      switch (assignment?.status) {
        case 'OPEN':
          return ['table-info'];
        case 'PARTIAL':
          return ['table-warning'];
        case 'FULL':
          return ['table-success'];
        default:
          return [];
      }
    },
  },
});
</script>

<style scoped>

</style>
