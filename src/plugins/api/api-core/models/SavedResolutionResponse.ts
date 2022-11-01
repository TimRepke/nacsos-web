/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotAnnotationModel } from './BotAnnotationModel';
import type { BotMetaResolve } from './BotMetaResolve';

export type SavedResolutionResponse = {
  bot_annotation_metadata_id: string;
  name: string;
  project_id: string;
  annotation_scope_id?: string;
  annotation_scheme_id?: string;
  meta: BotMetaResolve;
  saved: Array<BotAnnotationModel>;
};

