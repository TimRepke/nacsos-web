/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectBaseInfoScopeEntry = {
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
    scheme_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    scheme_name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
