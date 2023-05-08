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
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_updated: {
      type: 'string',
      format: 'date-time',
    },
    valid_till: {
      type: 'string',
      format: 'date-time',
    },
  },
} as const;
