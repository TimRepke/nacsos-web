/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationFilters } from './AnnotationFilters';

export type BotMetaResolveBase = {
  algorithm: BotMetaResolveBase.algorithm;
  filters: AnnotationFilters;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
  trust?: (Record<string, number> | null);
};

export namespace BotMetaResolveBase {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

