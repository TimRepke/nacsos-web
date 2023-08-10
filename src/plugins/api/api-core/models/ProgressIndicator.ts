/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentStatus } from './AssignmentStatus';
import type { ProgressIndicatorLabel } from './ProgressIndicatorLabel';

export type ProgressIndicator = {
  assignment_id: string;
  item_id: string;
  order: number;
  status: AssignmentStatus;
  labels: (Record<string, Array<ProgressIndicatorLabel>> | null);
};

