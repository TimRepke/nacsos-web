/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotKind } from './BotKind';

export type BotAnnotationMetaDataBaseModel = {
  bot_annotation_metadata_id?: string;
  name: string;
  kind: BotKind;
  project_id: string;
  time_created?: string;
  time_updated?: string;
  annotation_scope_id?: string;
  annotation_scheme_id?: string;
};

