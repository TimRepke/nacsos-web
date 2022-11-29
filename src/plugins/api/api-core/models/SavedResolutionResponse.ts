/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotMetaResolve } from './BotMetaResolve';

export type SavedResolutionResponse = {
  name: string;
  meta: BotMetaResolve;
  saved: Record<string, Array<Array<any>>>;
};

