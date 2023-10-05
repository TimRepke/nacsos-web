/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicAuthorModel } from './AcademicAuthorModel';
import type { ItemType } from './ItemType';

/**
 * Corresponds to db.schema.items.academic.AcademicItem
 */
export type AcademicItemModel = {
  item_id?: (string | null);
  project_id?: (string | null);
  type?: ItemType;
  text?: (string | null);
  doi?: (string | null);
  wos_id?: (string | null);
  scopus_id?: (string | null);
  openalex_id?: (string | null);
  s2_id?: (string | null);
  pubmed_id?: (string | null);
  dimensions_id?: (string | null);
  title?: (string | null);
  title_slug?: (string | null);
  publication_year?: (number | null);
  source?: (string | null);
  keywords?: (Array<string> | null);
  authors?: (Array<AcademicAuthorModel> | null);
  meta?: null;
};

