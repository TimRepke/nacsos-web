import type { HighlighterModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { DeferredValue, useDeferredValue } from "@/stores/storeHelpers";
import { Optional } from "@/types";
import { EventBus } from "@/plugins/events";
import { CurrentProjectSetEvent } from "@/plugins/events/events/projects";

export interface ProjectHighlighterStore extends DeferredValue<HighlighterModel[]> {
  applyActiveHighlighters: (txt: Optional<string>) => string | null;
}

export function useProjectHighlighters(): ProjectHighlighterStore {
  async function request(): Promise<HighlighterModel[]> {
    if (!currentProjectStore.projectId) return [];
    return (
      await API.highlighters.getProjectHighlightersApiHighlightersProjectGet({
        xProjectId: currentProjectStore.projectId as string,
      })
    ).data;
  }

  const base = useDeferredValue<HighlighterModel[]>([], request);

  EventBus.on(CurrentProjectSetEvent, () => {
    base.reload().then().catch();
  });

  return {
    ...base,
    applyActiveHighlighters(txt: Optional<string>): string | null {
      if (txt === null || txt === undefined || txt.trim().length === 0) return null;

      // Highlighters globally turned off --> return raw
      if (!interfaceSettingsStore.highlighters.enabled) return txt;

      // Get active highlighters for this project
      const activeHighlighters = new Set(
        interfaceSettingsStore.highlighters.active[currentProjectStore.projectId as string] ?? [],
      );

      // Apply each highlighter
      base.value.value.forEach((highlighter: HighlighterModel) => {
        if (activeHighlighters.has(highlighter.highlighter_id)) {
          try {
            const regex = new RegExp(highlighter.keywords.join("|"), "gi");
            txt = (txt as string).replaceAll(regex, `<span style="${highlighter.style}">$&</span>`);
          } catch (e) {
            console.warn("Ignoring illegal regex!");
            console.error(e);
          }
        }
      });
      return txt;
    },
  };
}
