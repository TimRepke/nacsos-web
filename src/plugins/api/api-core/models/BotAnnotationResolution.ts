/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotKind } from './BotKind';
import type { BotMetaResolve } from './BotMetaResolve';

export type BotAnnotationResolution = {
  bot_annotation_metadata_id?: (string | null);
  name: string;
  kind: BotKind;
  project_id: string;
  time_created?: (string | null);
  time_updated?: (string | null);
  assignment_scope_id?: (string | null);
  annotation_scheme_id?: (string | null);
  meta: BotMetaResolve;
};

