import type { UserModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { DeferredValue, useDeferredValue } from "@/stores/storeHelpers";
import { computed, ComputedRef } from "vue";

export interface Users extends DeferredValue<UserModel[]> {
  id2name: ComputedRef<Record<string, string>>;
  name2id: ComputedRef<Record<string, string>>;
  name2user: ComputedRef<Record<string, UserModel>>;
  id2user: ComputedRef<Record<string, UserModel>>;
  usernames: ComputedRef<string[]>;
  userIds: ComputedRef<string[]>;
}

export function useProjectUsers(): Users {
  async function request(): Promise<UserModel[]> {
    if (!currentProjectStore.projectId) return [];
    return (
      await API.users.getProjectUsersApiUsersListProjectProjectIdGet({
        path: { project_id: currentProjectStore.projectId as string },
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
    ).data;
  }

  const base = useDeferredValue<UserModel[]>([], request);

  return {
    ...base,
    id2name: computed(() => {
      return Object.fromEntries(base.value.value.map((user: UserModel) => [user.user_id, user.username]));
    }),
    name2id: computed(() => {
      return Object.fromEntries(base.value.value.map((user: UserModel) => [user.username, user.user_id]));
    }),
    name2user: computed(() => {
      return Object.fromEntries(base.value.value.map((user: UserModel) => [user.username, user]));
    }),
    id2user: computed(() => {
      return Object.fromEntries(base.value.value.map((user: UserModel) => [user.user_id, user]));
    }),
    usernames: computed(() => {
      return base.value.value.map((user: UserModel) => user.username as string);
    }),
    userIds: computed(() => {
      return base.value.value.map((user: UserModel) => user.user_id as string);
    }),
  };
}
