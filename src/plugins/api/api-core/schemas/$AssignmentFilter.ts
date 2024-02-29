/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentFilter = {
  properties: {
    filter: {
      properties: {
      },
    },
    mode: {
      type: 'number',
      isRequired: true,
    },
    scopes: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    scheme: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
