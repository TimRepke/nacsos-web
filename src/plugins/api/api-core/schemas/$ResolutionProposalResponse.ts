/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionProposalResponse = {
  properties: {
    matrix: {
      type: 'AnnotationMatrix',
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
