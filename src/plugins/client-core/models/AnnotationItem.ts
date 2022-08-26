/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeModel } from './AnnotationSchemeModel';
import type { AssignmentModel } from './AssignmentModel';
import type { AssignmentScopeModel } from './AssignmentScopeModel';
import type { ItemModel } from './ItemModel';
import type { TwitterItemModel } from './TwitterItemModel';

export type AnnotationItem = {
  scheme: AnnotationSchemeModel;
  assignment: AssignmentModel;
  scope: AssignmentScopeModel;
  item: (ItemModel | TwitterItemModel);
};

