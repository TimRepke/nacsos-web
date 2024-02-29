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
import type { MetaFilterBool } from './MetaFilterBool';
import type { MetaFilterInt } from './MetaFilterInt';
import type { MetaFilterStr } from './MetaFilterStr';

export type SubQuery = {
  filter?: any;
  and_?: null;
  or_?: null;
  not_?: ((FieldFilter | FieldFilters | LabelFilterMulti | LabelFilterBool | LabelFilterInt | AssignmentFilter | AnnotationFilter | ImportFilter | MetaFilterBool | MetaFilterInt | MetaFilterStr | SubQuery) | null);
};

