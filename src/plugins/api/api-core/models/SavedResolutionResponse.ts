/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotMetaResolve } from './BotMetaResolve';
import type { GroupedBotAnnotation } from './GroupedBotAnnotation';

export type SavedResolutionResponse = {
  name: string;
  meta: BotMetaResolve;
  saved: Record<string, Array<GroupedBotAnnotation>>;
};

