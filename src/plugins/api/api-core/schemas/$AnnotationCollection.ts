/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationCollection = {
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
          type: 'items',
        },
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
  },
} as const;
