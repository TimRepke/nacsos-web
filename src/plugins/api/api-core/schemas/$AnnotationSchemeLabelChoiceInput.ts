/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabelChoiceInput = {
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
          type: 'AnnotationSchemeLabelInput',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
