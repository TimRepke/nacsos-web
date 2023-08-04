/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Mention = {
  properties: {
    start: {
      type: 'number',
      isRequired: true,
    },
    end: {
      type: 'number',
      isRequired: true,
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'number',
      }],
      isRequired: true,
    },
  },
} as const;
