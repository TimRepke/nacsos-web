/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationFilters } from './AnnotationFilters';
import type { ResolutionSnapshotEntry } from './ResolutionSnapshotEntry';
import type { SnapshotEntry } from './SnapshotEntry';

export type BotMetaResolve = {
  algorithm: BotMetaResolve.algorithm;
  filters: AnnotationFilters;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
  trust?: (Record<string, number> | null);
  snapshot: Array<SnapshotEntry>;
  resolutions: Array<ResolutionSnapshotEntry>;
};

export namespace BotMetaResolve {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

