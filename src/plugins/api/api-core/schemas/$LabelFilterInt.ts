/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelFilterInt = {
  properties: {
    scopes: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    scheme: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    users: {
      type: 'any-of',
      contains: [{
        type: 'UsersFilter',
      }, {
        type: 'null',
      }],
    },
    repeats: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
    },
    key: {
      type: 'string',
      isRequired: true,
    },
    type: {
      type: 'Enum',
      isRequired: true,
    },
    filter: {
      properties: {
      },
    },
    value_type: {
      properties: {
      },
    },
    value_int: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    comp: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
