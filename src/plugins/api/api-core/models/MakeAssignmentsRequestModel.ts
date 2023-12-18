/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfig } from './AssignmentScopeRandomConfig';
import type { AssignmentScopeRandomWithExclusionConfig } from './AssignmentScopeRandomWithExclusionConfig';
import type { AssignmentScopeRandomWithNQLConfig } from './AssignmentScopeRandomWithNQLConfig';

export type MakeAssignmentsRequestModel = {
  annotation_scheme_id: string;
  scope_id: string;
  config: (AssignmentScopeRandomWithExclusionConfig | AssignmentScopeRandomWithNQLConfig | AssignmentScopeRandomConfig);
  save?: boolean;
};

