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
      type: 'array',
      contains: {
        type: 'BotAnnotationModel',
      },
      isRequired: true,
    },
  },
} as const;
