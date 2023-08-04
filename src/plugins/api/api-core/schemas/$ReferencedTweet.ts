/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ReferencedTweet = {
  properties: {
    id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'number',
      }],
      isRequired: true,
    },
    type: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const;
