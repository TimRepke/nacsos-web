/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AffiliationModel = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    country: {
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
  },
} as const;
