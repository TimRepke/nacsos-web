/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SearchResult = {
  properties: {
    query_time: {
      type: 'number',
      isRequired: true,
    },
    num_found: {
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
    histogram: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
