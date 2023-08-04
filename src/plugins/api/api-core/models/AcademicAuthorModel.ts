/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffiliationModel } from './AffiliationModel';

export type AcademicAuthorModel = {
  name: string;
  surname_initials?: (string | null);
  email?: (string | null);
  orcid?: (string | null);
  scopus_id?: (string | null);
  openalex_id?: (string | null);
  s2_id?: (string | null);
  affiliations?: (Array<AffiliationModel> | null);
};

