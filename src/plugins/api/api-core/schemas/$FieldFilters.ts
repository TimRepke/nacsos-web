/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FieldFilters = {
  properties: {
    field: {
      type: 'Enum',
      isRequired: true,
    },
    values: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
