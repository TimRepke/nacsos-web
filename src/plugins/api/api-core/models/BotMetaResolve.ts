/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollectionDB } from './AnnotationCollectionDB';
import type { AnnotationFilters } from './AnnotationFilters';

export type BotMetaResolve = {
  algorithm: BotMetaResolve.algorithm;
  filters: AnnotationFilters;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
  trust?: Record<string, number>;
  collection: AnnotationCollectionDB;
};

export namespace BotMetaResolve {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

