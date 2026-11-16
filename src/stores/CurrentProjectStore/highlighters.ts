import type { HighlighterModel } from "@/plugins/api/spec";
import { API } from "@/plugins/api";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { DeferredValue, useDeferredValue } from "@/stores/storeHelpers";
import { Optional } from "@/types";
import { EventBus } from "@/plugins/events";
import { CurrentProjectSetEvent } from "@/plugins/events/events/projects";
import { sanitizeHtml } from "@/util";
import { computed } from "vue";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ProjectHighlighterStore extends DeferredValue<HighlighterModel[]> {
  applyActiveHighlighters: (txt: Optional<string>) => string | null;
}

export function useProjectHighlighters(): ProjectHighlighterStore {
  async function request(): Promise<HighlighterModel[]> {
    if (!currentProjectStore.projectId) return [];
    return (
      await API.highlighters.getProjectHighlightersApiHighlightersProjectGet({
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
    ).data;
  }

  const base = useDeferredValue<HighlighterModel[]>([], request);

  EventBus.on(CurrentProjectSetEvent, () => {
    base.reload().then().catch();
  });

  const applicableHighlighters = computed(() => {
    // Get active highlighters for this project
    const activeHighlighters = new Set(
      interfaceSettingsStore.highlighters.active[currentProjectStore.projectId as string] ?? [],
    );
    const mapped: Record<string, (txt: string) => string> = {};

    // Highlighters globally turned off --> return raw
    if (!interfaceSettingsStore.highlighters.enabled) return mapped;

    base.value.value.forEach((highlighter: HighlighterModel) => {
      if (activeHighlighters.has(highlighter.highlighter_id)) {
        try {
          const keywords = highlighter.keywords.map((k) => k.trim()).filter((k) => k.length > 0);
          if (keywords.length === 0) return;
          const regex = new RegExp(keywords.join("|"), "gi");
          const style = escapeHtml(highlighter.style ?? "");
          console.log(regex);
          mapped[highlighter.highlighter_id] = (txt: string) => {
            return txt.replaceAll(regex, (match: string) => `<span style="${style}">${escapeHtml(match)}</span>`);
          };
        } catch (e) {
          console.warn("Ignoring illegal regex!");
          console.error(e);
        }
      }
    });
    return mapped;
  });

  return {
    ...base,
    applyActiveHighlighters(txt: Optional<string>): string | null {
      if (txt === null || txt === undefined || txt.trim().length === 0) return null;
      // Apply each highlighter
      Object.values(applicableHighlighters.value).forEach((highlighter) => {
        txt = highlighter(txt as string);
      });
      return sanitizeHtml(txt as string);
    },
  };
}
