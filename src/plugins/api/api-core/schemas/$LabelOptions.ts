/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LabelOptions = {
  properties: {
    key: {
      type: 'string',
      isRequired: true,
    },
    options_int: {
      type: 'array',
      contains: {
        type: 'number',
      },
    },
    options_bool: {
      type: 'array',
      contains: {
        type: 'boolean',
      },
    },
    options_multi: {
      type: 'array',
      contains: {
        type: 'number',
      },
    },
    strings: {
      type: 'boolean',
    },
  },
} as const;
