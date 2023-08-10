/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelOptionsInput = {
  properties: {
    key: {
      type: 'string',
      isRequired: true,
    },
    options_int: {
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
    options_bool: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'boolean',
        },
      }, {
        type: 'null',
      }],
    },
    options_multi: {
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
    strings: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
