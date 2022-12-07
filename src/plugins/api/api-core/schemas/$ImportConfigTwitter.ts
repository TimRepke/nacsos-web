/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportConfigTwitter = {
  properties: {
    query: {
      type: 'string',
      isRequired: true,
    },
    max_results: {
      type: 'number',
    },
    next_token: {
      type: 'string',
    },
    since_id: {
      type: 'string',
    },
    until_id: {
      type: 'string',
    },
    sort_order: {
      type: 'Enum',
    },
    start_time: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'date-time',
      }],
    },
    end_time: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'date-time',
      }],
    },
  },
} as const;
