/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentInfo } from './AssignmentInfo';

export type AssignmentScopeEntry = {
  item_id: string;
  first_occurrence: number;
  identifier: number;
  assignments: Array<AssignmentInfo>;
};

