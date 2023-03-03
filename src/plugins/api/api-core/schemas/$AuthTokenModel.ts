/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AuthTokenModel = {
  properties: {
    token_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    valid_till: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
