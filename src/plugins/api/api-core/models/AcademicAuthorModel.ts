/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffiliationModel } from './AffiliationModel';

export type AcademicAuthorModel = {
  name: string;
  surname_initials?: string;
  orcid?: string;
  affiliations?: Array<AffiliationModel>;
};

