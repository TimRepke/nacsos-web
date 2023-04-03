/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfig } from './AssignmentScopeRandomConfig';
import type { AssignmentScopeRandomWithExclusionConfig } from './AssignmentScopeRandomWithExclusionConfig';

export type MakeAssignmentsRequestModel = {
  annotation_scheme_id: string;
  scope_id: string;
  config: (AssignmentScopeRandomConfig | AssignmentScopeRandomWithExclusionConfig);
  save?: boolean;
};

