/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportFilter = {
  properties: {
    filter: {
      properties: {
      },
    },
    import_ids: {
      type: 'array',
      contains: {
        type: 'IEUUID',
      },
      isRequired: true,
    },
  },
} as const;
