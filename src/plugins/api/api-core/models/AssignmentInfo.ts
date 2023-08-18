/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentInfoLabel } from './AssignmentInfoLabel';
import type { AssignmentStatus } from './AssignmentStatus';

export type AssignmentInfo = {
  user_id: string;
  username: string;
  order: number;
  assignment_id: string;
  status: AssignmentStatus;
  labels?: (Record<string, Array<AssignmentInfoLabel>> | null);
};

