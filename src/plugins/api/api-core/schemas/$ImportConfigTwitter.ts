/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportConfigTwitter = {
  properties: {
    func_name: {
      properties: {
      },
      isRequired: true,
    },
    query: {
      type: 'string',
      isRequired: true,
    },
    max_results: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    next_token: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    since_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    until_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
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
      }, {
        type: 'null',
      }],
    },
    end_time: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    bearer_token: {
      type: 'string',
      isRequired: true,
    },
    results_per_response: {
      type: 'number',
    },
    max_requests: {
      type: 'number',
    },
    max_tweets: {
      type: 'number',
    },
  },
} as const;
