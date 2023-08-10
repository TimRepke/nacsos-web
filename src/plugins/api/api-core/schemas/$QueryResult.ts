/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QueryResult = {
  properties: {
    n_docs: {
      type: 'number',
      isRequired: true,
    },
    docs: {
      type: 'array',
      contains: {
        type: 'AcademicItemModel',
      },
      isRequired: true,
    },
  },
} as const;
