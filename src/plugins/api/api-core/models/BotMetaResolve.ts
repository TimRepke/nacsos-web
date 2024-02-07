/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ResolutionSnapshotEntry } from './ResolutionSnapshotEntry';
import type { SnapshotEntry } from './SnapshotEntry';

export type BotMetaResolve = {
  algorithm: BotMetaResolve.algorithm;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
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

