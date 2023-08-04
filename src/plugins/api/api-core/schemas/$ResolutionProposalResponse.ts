/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionProposalResponse = {
  properties: {
    collection: {
      type: 'AnnotationCollection',
      isRequired: true,
    },
    proposal: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'GroupedBotAnnotation',
        },
      },
      isRequired: true,
    },
    scheme_flat: {
      type: 'array',
      contains: {
        type: 'FlattenedAnnotationSchemeLabel',
      },
      isRequired: true,
    },
  },
} as const;
