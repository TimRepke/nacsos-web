/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationFilter } from './AnnotationFilter';
import type { AssignmentFilter } from './AssignmentFilter';
import type { FieldFilter } from './FieldFilter';
import type { FieldFilters } from './FieldFilters';
import type { ImportFilter } from './ImportFilter';
import type { LabelFilterBool } from './LabelFilterBool';
import type { LabelFilterInt } from './LabelFilterInt';
import type { LabelFilterMulti } from './LabelFilterMulti';
import type { LabelOptions } from './LabelOptions';
import type { MetaFilterBool } from './MetaFilterBool';
import type { MetaFilterInt } from './MetaFilterInt';
import type { MetaFilterStr } from './MetaFilterStr';
import type { SubQuery } from './SubQuery';

export type ExportRequest = {
  labels: Array<LabelOptions>;
  nql_filter?: ((FieldFilter | FieldFilters | LabelFilterMulti | LabelFilterBool | LabelFilterInt | AssignmentFilter | AnnotationFilter | ImportFilter | MetaFilterBool | MetaFilterInt | MetaFilterStr | SubQuery) | null);
  bot_annotation_metadata_ids?: (Array<string> | null);
  assignment_scope_ids?: (Array<string> | null);
  user_ids?: (Array<string> | null);
  ignore_hierarchy?: boolean;
  ignore_repeat?: boolean;
};

