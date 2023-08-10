/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemModel } from './AcademicItemModel';

export type SearchResult = {
  query_time: number;
  num_found: number;
  docs: Array<AcademicItemModel>;
  histogram: (Record<string, number> | null);
};

