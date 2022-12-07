/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfig } from './AssignmentScopeRandomConfig';

export type MakeAssignmentsRequestModel = {
  annotation_scheme_id: string;
  scope_id: string;
  config: AssignmentScopeRandomConfig;
  save?: boolean;
};

