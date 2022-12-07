/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';
import type { AnnotationSchemeModel } from './AnnotationSchemeModel';
import type { AssignmentModel } from './AssignmentModel';
import type { AssignmentScopeModel } from './AssignmentScopeModel';
import type { GenericItemModel } from './GenericItemModel';
import type { TwitterItemModel } from './TwitterItemModel';

export type AnnotationItem = {
  scheme: AnnotationSchemeModel;
  assignment: AssignmentModel;
  scope: AssignmentScopeModel;
  item: (GenericItemModel | TwitterItemModel | AcademicItemModel);
};

