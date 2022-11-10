/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotAnnotationModel } from './BotAnnotationModel';
import type { BotMetaResolve } from './BotMetaResolve';

export type SavedResolutionResponse = {
  meta: BotMetaResolve;
  saved: Array<BotAnnotationModel>;
};

