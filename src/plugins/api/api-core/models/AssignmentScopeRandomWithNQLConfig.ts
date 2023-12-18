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
import type { MetaFilter } from './MetaFilter';
import type { SubQuery } from './SubQuery';

export type AssignmentScopeRandomWithNQLConfig = {
  config_type?: any;
  users?: (Array<string> | null);
  num_items: number;
  min_assignments_per_item: number;
  max_assignments_per_item: number;
  num_multi_coded_items: number;
  random_seed: number;
  query_parsed: (FieldFilter | FieldFilters | LabelFilterMulti | LabelFilterBool | LabelFilterInt | AssignmentFilter | AnnotationFilter | ImportFilter | MetaFilter | SubQuery);
  query_str: string;
};

