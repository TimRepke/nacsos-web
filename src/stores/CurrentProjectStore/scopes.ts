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
    return {
      bot: (
        await API.annotations.getBotScopesApiAnnotationsBotScopesGet({
          xProjectId: currentProjectStore.projectId as string,
        })
      ).data,
      human: (
        await API.annotations.getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
          xProjectId: currentProjectStore.projectId as string,
        })
      ).data,
    };
  }

  const base = useDeferredValue<Scopes>({ human: [], bot: [] }, request);

  return {
    ...base,
    lookup: computed(() =>
      Object.fromEntries(
        (base.value.value.bot as (BotAnnotationMetaDataModel | AssignmentScopeModel)[])
          .concat(base.value.value.human)
          .map((entry) => [
            ((entry as AssignmentScopeModel).assignment_scope_id ??
              (entry as BotAnnotationMetaDataModel).bot_annotation_metadata_id) as string,
            {
              bot: "bot_annotation_metadata_id" in entry ? (entry as BotAnnotationMetaDataModel) : undefined,
              human: "assignment_scope_id" in entry ? (entry as AssignmentScopeModel) : undefined,
            },
          ]),
      ),
    ),
  };
}
