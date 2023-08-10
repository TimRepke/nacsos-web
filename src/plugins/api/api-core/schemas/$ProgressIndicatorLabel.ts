/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProgressIndicatorLabel = {
  properties: {
    repeat: {
      type: 'number',
      isRequired: true,
    },
    value_int: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
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
