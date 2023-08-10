/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabelInput = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    key: {
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
    max_repeat: {
      type: 'number',
    },
    required: {
      type: 'boolean',
    },
    dropdown: {
      type: 'boolean',
    },
    kind: {
      type: 'Enum',
    },
    choices: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'AnnotationSchemeLabelChoiceInput',
        },
      }, {
        type: 'null',
      }],
    },
    annotation: {
      type: 'any-of',
      contains: [{
        type: 'AnnotationModelInput',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
