/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentScopeRandomConfigInput } from './AssignmentScopeRandomConfigInput';
import type { AssignmentScopeRandomWithExclusionConfigInput } from './AssignmentScopeRandomWithExclusionConfigInput';

/**
 *
 * AssignmentScope can be used to logically group a set of Assignments.
 * For example, one may wish to re-use the same AnnotationScheme several times within a project
 * without copying it each time. It may also be used to logically group different scopes of
 * the annotation process, for example to make it clear that different subsets of a dataset
 * are to be annotated.
 * Logically, this should be viewed as a hierarchical organisation
 * AnnotationScheme -> [AssignmentScope] -> Assignment -> Annotation
 *
 */
export type AssignmentScopeModelInput = {
  assignment_scope_id?: (string | null);
  annotation_scheme_id: string;
  time_created?: (string | null);
  name: string;
  description?: (string | null);
  config?: (AssignmentScopeRandomWithExclusionConfigInput | AssignmentScopeRandomConfigInput | null);
  highlighter_ids?: (Array<string> | null);
};

