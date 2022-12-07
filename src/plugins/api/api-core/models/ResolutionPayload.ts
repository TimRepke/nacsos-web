/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollectionDB } from './AnnotationCollectionDB';
import type { AnnotationFilters } from './AnnotationFilters';
import type { BotAnnotationModel } from './BotAnnotationModel';

export type ResolutionPayload = {
  name: string;
  strategy: ResolutionPayload.strategy;
  filters: AnnotationFilters;
  ignore_order: boolean;
  ignore_hierarchy: boolean;
  collection: AnnotationCollectionDB;
  bot_annotations: Array<BotAnnotationModel>;
};

export namespace ResolutionPayload {

  export enum strategy {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

