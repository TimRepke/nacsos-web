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

export interface ItemDisplaySettings {
  columns?: number;
}

// Columns to show in the quality monitor
export interface QualityColumnsSettings {
  cohen: boolean;
  fleiss: boolean;
  randolph: boolean;
  krippendorff: boolean;
  pearson: boolean;
  kendall: boolean;
  spearman: boolean;
  precision: boolean;
  recall: boolean;
  f1: boolean;
  multi_overlap_mean: boolean;
  multi_overlap_median: boolean;
  num_overlap: boolean;
  num_agreement: boolean;
}

export type InterfaceSettingsState = {
  annotation: RemovableRef<AnnotationSettings>;
  itemDisplay: RemovableRef<ItemDisplaySettings>;
  qualityColumns: RemovableRef<QualityColumnsSettings>;
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
      itemDisplay: useStorage<ItemDisplaySettings>(
        "nacsos:ui-settings:item-display",
        {
          columns: undefined,
        } as ItemDisplaySettings,
        undefined,
        { mergeDefaults: true },
      ),
      qualityColumns: useStorage<QualityColumnsSettings>(
        "nacsos:ui-settings:quality-columns",
        {
          cohen: true,
          fleiss: false,
          randolph: false,
          krippendorff: false,
          pearson: true,
          kendall: false,
          spearman: false,
          precision: true,
          recall: true,
          f1: false,
          multi_overlap_mean: true,
          multi_overlap_median: false,
          num_overlap: false,
          num_agreement: true,
        } as QualityColumnsSettings,
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
    itemColumnStyle(): Record<string, string> {
      if (this.itemDisplay.columns && this.itemDisplay.columns > 1) {
        return {
          "column-count": `${this.itemDisplay.columns}`,
          "column-gap": "40px",
          "column-rule": "1px solid lightgrey",
        };
      }
      return {};
    },
  },
});
