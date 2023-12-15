/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentFilter = {
  properties: {
    filter: {
      properties: {
      },
      isRequired: true,
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
  },
} as const;
