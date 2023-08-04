/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Body_login_for_access_token_api_login_token_post = {
  properties: {
    grant_type: {
      type: 'any-of',
      contains: [{
        type: 'string',
        pattern: 'password',
      }, {
        type: 'null',
      }],
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    password: {
      type: 'string',
      isRequired: true,
    },
    scope: {
      type: 'string',
    },
    client_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    client_secret: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
