/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffiliationModel } from './AffiliationModel';

export type AcademicAuthorModel = {
  name: string;
  surname_initials?: string;
  email?: string;
  orcid?: string;
  scopus_id?: string;
  openalex_id?: string;
  s2_id?: string;
  affiliations?: Array<AffiliationModel>;
};

