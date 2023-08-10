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
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    email: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    orcid: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    scopus_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    openalex_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    s2_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    affiliations: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'AffiliationModel',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
