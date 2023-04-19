/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfig } from './AssignmentScopeRandomConfig';
import type { AssignmentScopeRandomWithExclusionConfig } from './AssignmentScopeRandomWithExclusionConfig';

/**
 * AssignmentScope can be used to logically group a set of Assignments.
 * For example, one may wish to re-use the same AnnotationScheme several times within a project
 * without copying it each time. It may also be used to logically group different scopes of
 * the annotation process, for example to make it clear that different subsets of a dataset
 * are to be annotated.
 * Logically, this should be viewed as a hierarchical organisation
 * AnnotationScheme -> [AssignmentScope] -> Assignment -> Annotation
 */
export type AssignmentScopeModel = {
  assignment_scope_id?: string;
  annotation_scheme_id: string;
  time_created?: string;
  name: string;
  description?: string;
  config?: (AssignmentScopeRandomWithExclusionConfig | AssignmentScopeRandomConfig);
  highlighter_ids?: Array<string>;
};

