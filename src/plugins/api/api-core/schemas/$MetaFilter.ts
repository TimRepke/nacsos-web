/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MetaFilter = {
  properties: {
    filter: {
      properties: {
      },
    },
    field: {
      type: 'string',
      isRequired: true,
    },
    comp: {
      type: 'string',
      isRequired: true,
    },
    value: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'number',
      }, {
        type: 'boolean',
      }],
      isRequired: true,
    },
  },
} as const;
