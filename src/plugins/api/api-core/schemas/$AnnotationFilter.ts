/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationFilter = {
  properties: {
    filter: {
      properties: {
      },
      isRequired: true,
    },
    incl: {
      type: 'boolean',
      isRequired: true,
    },
    scopes: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
