/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GroupedAnnotations = {
  properties: {
    path: {
      type: 'array',
      contains: {
        type: 'Label',
      },
      isRequired: true,
    },
    annotations: {
      type: 'array',
      contains: {
        type: 'AnnotationModel',
      },
      isRequired: true,
    },
  },
} as const;
