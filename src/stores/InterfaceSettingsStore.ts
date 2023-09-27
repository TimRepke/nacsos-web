import { defineStore } from "pinia";
import type { Store } from "pinia";
import { useStorage } from "@vueuse/core";
import type { RemovableRef } from "@vueuse/core";

export interface AnnotationSettings {
  // true: colour "icons" in the progressbar by assignment status (e.g. OPEN, PARTIAL, FULL)
  // progressBarUseStatus: boolean; (computed)
  // if progressBarUseStatus is false, use value from this label key to colour the progress "icon"
  progressBarLabelKey?: string;
  progressBarLabelRepeat?: number;
  // width of the annotation sidebar
  sidebarWidth: number;
}

export type InterfaceSettingsState = {
  annotation: RemovableRef<AnnotationSettings>;
};
export type InterfaceSettingsActions = Record<string, never>;
export type InterfaceSettingsGetters = Record<string, never>;

export type InterfaceSettingsStoreType = Store<
  "InterfaceSettingsStore",
  InterfaceSettingsState,
  InterfaceSettingsGetters,
  InterfaceSettingsActions
>;

export const useInterfaceSettingsStore = defineStore("InterfaceSettingsStore", {
  state(): InterfaceSettingsState {
    return {
      annotation: useStorage<AnnotationSettings>(
        "nacsos:ui-settings:annotation",
        {
          sidebarWidth: 5,
          progressBarLabelRepeat: 1,
        } as AnnotationSettings,
        undefined,
        { mergeDefaults: true },
      ),
    };
  },
  actions: {
    // pass
  },
  getters: {
    annotationProgressBarUseStatus(): boolean {
      return this.annotation.progressBarLabelKey === undefined;
    },
  },
});
