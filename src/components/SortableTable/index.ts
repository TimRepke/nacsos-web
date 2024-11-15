import type { InjectionKey, Ref } from "vue";

export enum Sort {
  sort = "sort", // ignored
  "sort-up" = "sort-up", // ascending
  "sort-down" = "sort-down", // descending
}

export interface SortTableStore {
  sortBy: Ref<string | null>;
  sortOrder: Ref<number>;
  sort: (key: string) => void;
}

export const sortTableStoreKey = Symbol() as InjectionKey<SortTableStore>;
