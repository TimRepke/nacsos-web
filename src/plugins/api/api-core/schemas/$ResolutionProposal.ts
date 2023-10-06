/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionProposal = {
  properties: {
    scheme_info: {
      type: 'AnnotationSchemeInfo',
      isRequired: true,
    },
    labels: {
      type: 'array',
      contains: {
        type: 'FlatLabel',
      },
      isRequired: true,
    },
    annotators: {
      type: 'array',
      contains: {
        type: 'UserModel',
      },
      isRequired: true,
    },
    ordering: {
      type: 'array',
      contains: {
        type: 'ResolutionOrdering',
      },
      isRequired: true,
    },
    matrix: {
      type: 'dictionary',
      contains: {
        type: 'dictionary',
        contains: {
          type: 'ResolutionCell',
        },
      },
      isRequired: true,
    },
  },
} as const;
