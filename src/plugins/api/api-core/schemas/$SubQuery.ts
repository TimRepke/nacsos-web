/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubQuery = {
  properties: {
    filter: {
      properties: {
      },
      isRequired: true,
    },
    and_: {
      type: 'any-of',
      contains: [{
        type: 'null',
      }],
    },
    or_: {
      type: 'any-of',
      contains: [{
        type: 'null',
      }],
    },
  },
} as const;
