/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FieldFilter = {
  properties: {
    field: {
      type: 'Enum',
      isRequired: true,
    },
    value: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'number',
      }],
      isRequired: true,
    },
    comp: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
