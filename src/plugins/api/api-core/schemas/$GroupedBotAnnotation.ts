/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GroupedBotAnnotation = {
  properties: {
    path: {
      type: 'array',
      contains: {
        type: 'Label',
      },
      isRequired: true,
    },
    annotation: {
      type: 'BotAnnotationModel',
      isRequired: true,
    },
  },
} as const;
