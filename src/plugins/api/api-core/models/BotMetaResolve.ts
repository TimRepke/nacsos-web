/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollectionDBOutput } from './AnnotationCollectionDBOutput';
import type { AnnotationFiltersOutput } from './AnnotationFiltersOutput';

export type BotMetaResolve = {
  algorithm: BotMetaResolve.algorithm;
  filters: AnnotationFiltersOutput;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
  trust: (Record<string, number> | null);
  collection: AnnotationCollectionDBOutput;
};

export namespace BotMetaResolve {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

