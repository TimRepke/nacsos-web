/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationMatrix = {
  properties: {
    scheme_id: {
      type: 'string',
      isRequired: true,
    },
    keys: {
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
            type: 'any-of',
            contains: [{
              type: 'number',
            }, {
              type: 'number',
            }, {
              type: 'boolean',
            }, {
              type: 'string',
            }],
          },
        },
      },
      isRequired: true,
    },
  },
} as const;
