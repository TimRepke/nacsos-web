/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelFilterMulti = {
  properties: {
    filter: {
      properties: {
      },
    },
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
    multi_int: {
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
    comp: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;