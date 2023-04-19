import { defineStore } from 'pinia';
import type { Store } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { RemovableRef } from '@vueuse/core';

export interface AnnotationSettings {
  // true: colour "icons" in the progressbar by assignment status (e.g. OPEN, PARTIAL, FULL)
  progressBarUseStatus: boolean;
  // if progressBarUseStatus is false, use value from this label key to colour the progress "icon"
  progressBarLabelKey?: string;
  // width of the annotation sidebar
  sidebarWidth: number;
}

export type InterfaceSettingsState = {
  annotation: RemovableRef<AnnotationSettings>,
};
export type InterfaceSettingsActions = {};
export type InterfaceSettingsGetters = {};

export type InterfaceSettingsStoreType = Store<'InterfaceSettingsStore', InterfaceSettingsState, InterfaceSettingsGetters, InterfaceSettingsActions>;

export const useInterfaceSettingsStore = defineStore('InterfaceSettingsStore', {
  state(): InterfaceSettingsState {
    return {
      annotation: useStorage<AnnotationSettings>(
        'nacsos:ui-settings:annotation',
        {
          progressBarUseStatus: true,
          sidebarWidth: 5,
        },
        undefined,
        { mergeDefaults: true },
      ),
    };
  },
  actions: {
    // pass
  },
  getters: {
    // pass
  },
});
