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
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'AcademicItemModel',
        },
      }, {
        type: 'array',
        contains: {
          type: 'FullLexisNexisItemModel',
        },
      }],
      isRequired: true,
    },
  },
} as const;
