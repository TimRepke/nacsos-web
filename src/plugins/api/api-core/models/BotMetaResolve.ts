/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationFilters } from './AnnotationFilters';
import type { AnnotationMatrix } from './AnnotationMatrix';

export type BotMetaResolve = {
  algorithm: BotMetaResolve.algorithm;
  filters: AnnotationFilters;
  matrix: AnnotationMatrix;
  trust?: Record<string, number>;
};

export namespace BotMetaResolve {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

