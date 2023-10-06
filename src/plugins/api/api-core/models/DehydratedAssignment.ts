/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentStatus } from './AssignmentStatus';

export type DehydratedAssignment = {
  assignment_id: string;
  user_id: string;
  item_id: string;
  username: string;
  status: AssignmentStatus;
  order: number;
};

