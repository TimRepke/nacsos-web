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
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    time_updated: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    valid_till: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
