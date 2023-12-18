/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';
import type { FullLexisNexisItemModel } from './FullLexisNexisItemModel';
import type { GenericItemModel } from './GenericItemModel';

export type QueryResult = {
  n_docs: number;
  docs: (Array<AcademicItemModel> | Array<FullLexisNexisItemModel> | Array<GenericItemModel>);
};

