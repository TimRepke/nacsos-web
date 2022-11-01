/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationMatrix = {
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
          type: 'array',
          contains: {
            properties: {
            },
          },
        },
      },
      isRequired: true,
    },
    users: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    matrix: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'array',
          contains: {
            type: 'array',
            contains: {
              properties: {
              },
            },
          },
        },
      },
      isRequired: true,
    },
  },
} as const;
