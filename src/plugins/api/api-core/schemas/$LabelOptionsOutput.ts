/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelOptionsOutput = {
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
    },
    strings: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
