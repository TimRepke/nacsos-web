/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QueryGroup = {
  properties: {
    condition: {
      type: 'all-of',
      contains: [{
        type: 'Condition',
      }],
    },
    members: {
      type: 'array',
      contains: {
        type: 'any-of',
        contains: [{
          type: 'Filter',
        }, {
          type: 'QueryGroup',
        }],
      },
      isRequired: true,
    },
  },
} as const;
