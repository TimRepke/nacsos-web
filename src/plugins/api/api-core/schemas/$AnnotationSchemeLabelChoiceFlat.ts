/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabelChoiceFlat = {
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
  },
} as const;
