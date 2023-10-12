/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';
import type { AnnotationSchemeModel } from './AnnotationSchemeModel';
import type { AssignmentModel } from './AssignmentModel';
import type { AssignmentScopeModel } from './AssignmentScopeModel';
import type { FullLexisNexisItemModel } from './FullLexisNexisItemModel';
import type { GenericItemModel } from './GenericItemModel';
import type { LexisNexisItemModel } from './LexisNexisItemModel';
import type { TwitterItemModel } from './TwitterItemModel';

export type AnnotationItem = {
  scheme: AnnotationSchemeModel;
  assignment: AssignmentModel;
  scope: AssignmentScopeModel;
  item: (TwitterItemModel | AcademicItemModel | LexisNexisItemModel | FullLexisNexisItemModel | GenericItemModel);
};

