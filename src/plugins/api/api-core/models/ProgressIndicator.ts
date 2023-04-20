/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentStatus } from './AssignmentStatus';

export type ProgressIndicator = {
  assignment_id: string;
  item_id: string;
  order: number;
  status: AssignmentStatus;
  value_int?: number;
  value_bool?: boolean;
};

