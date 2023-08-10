/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollectionDBInput } from './AnnotationCollectionDBInput';
import type { AnnotationFiltersInput } from './AnnotationFiltersInput';
import type { BotAnnotationModelInput } from './BotAnnotationModelInput';

export type ResolutionPayload = {
  name: string;
  strategy: ResolutionPayload.strategy;
  filters: AnnotationFiltersInput;
  ignore_order: boolean;
  ignore_hierarchy: boolean;
  collection: AnnotationCollectionDBInput;
  bot_annotations: Array<BotAnnotationModelInput>;
};

export namespace ResolutionPayload {

  export enum strategy {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

