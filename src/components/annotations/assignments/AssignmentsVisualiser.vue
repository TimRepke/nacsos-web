<template>
  <div>
    <div class="table-responsive ">
      <table class="table table-bordered">
        <tbody>
        <tr v-for="userId in userIds" :key="userId">
          <th>{{ userLookup[userId]?.username }}</th>
          <td v-for="itemId in itemIds" :key="itemId"
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

import { Assignment } from '@/types/annotation.d';
import { PropType } from 'vue';
import { callUsersDetailsEndpoint } from '@/plugins/api/users';
import { User } from '@/types/user.d';

export default {
  name: 'AssignmentsVisualiser',
  props: {
    assignments: {
      type: Object as PropType<Assignment[]>,
      default: (): Assignment[] => [] as Assignment[],
    },
  },
  data() {
    return {
      users: [] as User[],
    };
  },
  computed: {
    lookup() {
      const ret = this.itemIds.reduce((acc: { [key: string]: Assignment[] }, itemId: string) => {
        acc[itemId] = [];
        return acc;
      }, {});
      this.assignments.forEach((assignment: Assignment) => {
        ret[assignment.item_id].push(assignment);
      });
      return ret;
    },
    userIds() {
      return [...new Set(this.assignments.map((assignment: Assignment) => assignment.user_id))];
    },
    itemIds() {
      return [...new Set(this.assignments.map((assignment: Assignment) => assignment.item_id))];
    },
    userLookup() {
      return this.users.reduce((acc: { [key: string]: User }, user: User) => {
        acc[user.user_id!] = user;
        return acc;
      }, {});
    },
  },
  watch: {
    async userIds(userIds: string[]) {
      this.users = (await callUsersDetailsEndpoint({ user_id: userIds })).payload;
    },
  },
  methods: {
    tryGetAssignment(userId: string, itemId: string): Assignment | undefined {
      return this.lookup[itemId]?.find((assignment: Assignment) => assignment.user_id === userId);
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
};
</script>

<style scoped>

</style>
