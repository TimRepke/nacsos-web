/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelFilterBool = {
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
    comp: {
      properties: {
      },
    },
    value_bool: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
