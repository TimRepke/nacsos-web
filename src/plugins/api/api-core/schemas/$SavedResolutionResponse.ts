/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SavedResolutionResponse = {
  properties: {
    meta: {
      type: 'BotMetaResolve',
      isRequired: true,
    },
    saved: {
      type: 'array',
      contains: {
        type: 'BotAnnotationModel',
      },
      isRequired: true,
    },
  },
} as const;
