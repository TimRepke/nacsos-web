/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AcademicAuthorModel = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    surname_initials: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    orcid: {
      type: 'string',
    },
    scopus_id: {
      type: 'string',
    },
    openalex_id: {
      type: 'string',
    },
    s2_id: {
      type: 'string',
    },
    affiliations: {
      type: 'array',
      contains: {
        type: 'AffiliationModel',
      },
    },
  },
} as const;
