/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicAuthorModel } from './AcademicAuthorModel';
import type { ItemType } from './ItemType';

/**
 * Corresponds to db.schema.items.academic.AcademicItem
 */
export type AcademicItemModel = {
  item_id?: string;
  project_id?: string;
  type?: ItemType;
  text?: string;
  doi?: string;
  wos_id?: string;
  scopus_id?: string;
  openalex_id?: string;
  s2_id?: string;
  pubmed_id?: string;
  title?: string;
  title_slug?: string;
  publication_year?: number;
  source?: string;
  keywords?: Array<string>;
  authors?: Array<AcademicAuthorModel>;
  meta?: any;
};

