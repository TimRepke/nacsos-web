/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';
import type { FullLexisNexisItemModel } from './FullLexisNexisItemModel';

export type QueryResult = {
  n_docs: number;
  docs: (Array<AcademicItemModel> | Array<FullLexisNexisItemModel>);
};

