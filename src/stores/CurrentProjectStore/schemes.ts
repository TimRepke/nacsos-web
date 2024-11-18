import { computed, ComputedRef } from "vue";
import type { AnnotationSchemeModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { DeferredValue, useDeferredValue } from "@/stores/storeHelpers";

export interface ProjectAnnotationSchemesStore extends DeferredValue<AnnotationSchemeModel[]> {
  lookup: ComputedRef<Record<string, AnnotationSchemeModel>>;
}

export function useProjectAnnotationSchemesStore(): ProjectAnnotationSchemesStore {
  async function request(): Promise<AnnotationSchemeModel[]> {
    if (!currentProjectStore.projectId) return [];
    return (
      await API.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListGet({
        xProjectId: currentProjectStore.projectId as string,
      })
    ).data;
  }

  const base = useDeferredValue<AnnotationSchemeModel[]>([], request);

  // EventBus.on(CurrentProjectSetEvent, () => {
  //   base.reload().then().catch();
  // });

  return {
    ...base,
    lookup: computed(() => Object.fromEntries(base.value.value.map((entry) => [entry.annotation_scheme_id, entry]))),
  };
}
