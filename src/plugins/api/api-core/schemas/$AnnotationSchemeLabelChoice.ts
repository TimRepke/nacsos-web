/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabelChoice = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    hint: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    value: {
      type: 'number',
      isRequired: true,
    },
    children: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'AnnotationSchemeLabel',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
