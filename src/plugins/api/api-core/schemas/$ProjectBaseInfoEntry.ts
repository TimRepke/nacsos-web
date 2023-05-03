/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectBaseInfoEntry = {
  properties: {
    id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
