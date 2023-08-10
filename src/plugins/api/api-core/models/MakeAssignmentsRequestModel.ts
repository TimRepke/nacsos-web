/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfigInput } from './AssignmentScopeRandomConfigInput';
import type { AssignmentScopeRandomWithExclusionConfigInput } from './AssignmentScopeRandomWithExclusionConfigInput';

export type MakeAssignmentsRequestModel = {
  annotation_scheme_id: string;
  scope_id: string;
  config: (AssignmentScopeRandomWithExclusionConfigInput | AssignmentScopeRandomConfigInput);
  save?: boolean;
};

