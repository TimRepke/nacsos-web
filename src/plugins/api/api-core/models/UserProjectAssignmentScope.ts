/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeModel } from './AssignmentScopeModel';

export type UserProjectAssignmentScope = {
  scope: AssignmentScopeModel;
  scheme_name: string;
  scheme_description: string;
  num_assignments: number;
  num_open: number;
  num_partial: number;
  num_completed: number;
};

