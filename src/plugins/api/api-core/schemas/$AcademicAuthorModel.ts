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
    orcid: {
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
