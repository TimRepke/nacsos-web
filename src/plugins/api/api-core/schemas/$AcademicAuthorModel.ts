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
    },
    email: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    orcid: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    scopus_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    openalex_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    s2_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
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
    },
  },
} as const;
