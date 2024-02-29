/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationFilter = {
  properties: {
    filter: {
      properties: {
      },
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
    },
    scheme: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
