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
      type: 'string',
    },
    value: {
      type: 'number',
      isRequired: true,
    },
    children: {
      type: 'array',
      contains: {
        type: 'AnnotationSchemeLabel',
      },
    },
  },
} as const;
