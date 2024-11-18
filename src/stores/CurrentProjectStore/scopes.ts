import { computed, ComputedRef } from "vue";
import type { AssignmentScopeModel, BotAnnotationMetaDataModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { DeferredValue, useDeferredValue } from "@/stores/storeHelpers";

type Scopes = {
  human: AssignmentScopeModel[];
  bot: BotAnnotationMetaDataModel[];
};

export interface ScopesStore extends DeferredValue<Scopes> {
  lookup: ComputedRef<Record<string, { human?: AssignmentScopeModel; bot?: BotAnnotationMetaDataModel }>>;
}

export function useScopesStore(): ScopesStore {
  async function request(): Promise<Scopes> {
    if (!currentProjectStore.projectId) return { bot: [], human: [] };
    return {
      bot: (
        await API.annotations.getBotScopesApiAnnotationsBotScopesGet({
          xProjectId: currentProjectStore.projectId as string,
        })
      ).data,
      human: (
        await API.annotations.getAssignmentScopesForProjectApiAnnotationsAssignmentsScopesGet({
          xProjectId: currentProjectStore.projectId as string,
        })
      ).data,
    };
  }

  const base = useDeferredValue<Scopes>({ human: [], bot: [] }, request);

  return {
    ...base,
    lookup: computed(() =>
      Object.fromEntries([
        ...base.value.value.bot.map((entry) => [entry.bot_annotation_metadata_id as string, { bot: entry }]),
        ...base.value.value.human.map((entry) => [entry.assignment_scope_id as string, { human: entry }]),
      ]),
    ),
  };
}
