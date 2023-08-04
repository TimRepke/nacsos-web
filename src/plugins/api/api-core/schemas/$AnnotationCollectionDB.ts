/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationCollectionDB = {
  properties: {
    scheme_id: {
      type: 'string',
      isRequired: true,
    },
    labels: {
      type: 'array',
      contains: {
        type: 'array',
        contains: {
          type: 'Label',
        },
      },
      isRequired: true,
    },
    annotations: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'GroupedAnnotations',
        },
      },
      isRequired: true,
    },
    annotators: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
