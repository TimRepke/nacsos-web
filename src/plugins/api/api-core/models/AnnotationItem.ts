/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';
import type { AnnotationSchemeModelOutput } from './AnnotationSchemeModelOutput';
import type { AssignmentModelOutput } from './AssignmentModelOutput';
import type { AssignmentScopeModelOutput } from './AssignmentScopeModelOutput';
import type { GenericItemModel } from './GenericItemModel';
import type { TwitterItemModelOutput } from './TwitterItemModelOutput';

export type AnnotationItem = {
  scheme: AnnotationSchemeModelOutput;
  assignment: AssignmentModelOutput;
  scope: AssignmentScopeModelOutput;
  item: (TwitterItemModelOutput | AcademicItemModel | GenericItemModel);
};

