import { defineStore } from "pinia";
import type { RemovableRef } from "@vueuse/core";
import { useStorage } from "@vueuse/core";
import Serializer from "@/types/serializer";
import type { DehydratedUser } from "@/plugins/api/spec/types.gen";
import { API } from "@/plugins/api";

const UsersSerializer = Serializer<Array<DehydratedUser>>();

export type PlatformUsersStoreType = {
  users: RemovableRef<Array<DehydratedUser>>;
  lastUpdate: RemovableRef<number>;
};
const MAX_LIFETIME = 5 * 60 * 1000; // 5min

export const usePlatformUsersStore = defineStore("PlatformUsersStore", {
  state(): PlatformUsersStoreType {
    const users = useStorage<Array<DehydratedUser>>("nacsos:cache:users", [], undefined, {
      serializer: UsersSerializer,
    });
    const lastUpdate = useStorage<number>("nacsos:cache:users-age", 0);

    return {
      users,
      lastUpdate,
    };
  },
  actions: {
    async refresh() {
      try {
        this.users = (await API.users.getAllUsersDehydratedApiUsersListAllDehydratedGet()).data;
        this.lastUpdate = Date.now();
      } catch (reason) {
        console.error(reason);
      }
    },
    async maybeRefresh(): Promise<void> {
      if (Date.now() - (this.lastUpdate || 0) > MAX_LIFETIME || !this.users) {
        await this.refresh();
      }
    },
    async getUsernameLookup(): Promise<Record<string, DehydratedUser>> {
      await this.maybeRefresh();
      return this.usernameLookup;
    },
    async getUserLookup(): Promise<Record<string, DehydratedUser>> {
      await this.maybeRefresh();
      return this.userLookup;
    },
  },
  getters: {
    usernameLookup(): Record<string, DehydratedUser> {
      return Object.fromEntries(this.users.map((user: DehydratedUser) => [user.username, user]));
    },
    userLookup(): Record<string, DehydratedUser> {
      return Object.fromEntries(this.users.map((user: DehydratedUser) => [user.user_id, user]));
    },
  },
});
