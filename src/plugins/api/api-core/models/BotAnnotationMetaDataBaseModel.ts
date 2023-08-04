/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotKind } from './BotKind';

export type BotAnnotationMetaDataBaseModel = {
  bot_annotation_metadata_id?: (string | null);
  name: string;
  kind: BotKind;
  project_id: string;
  time_created?: (string | null);
  time_updated?: (string | null);
  assignment_scope_id?: (string | null);
  annotation_scheme_id?: (string | null);
};

