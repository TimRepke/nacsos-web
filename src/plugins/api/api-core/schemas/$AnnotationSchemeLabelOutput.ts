/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabelOutput = {
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
      isRequired: true,
    },
    max_repeat: {
      type: 'number',
      isRequired: true,
    },
    required: {
      type: 'boolean',
      isRequired: true,
    },
    dropdown: {
      type: 'boolean',
      isRequired: true,
    },
    kind: {
      type: 'Enum',
      isRequired: true,
    },
    choices: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'AnnotationSchemeLabelChoiceOutput',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    annotation: {
      type: 'any-of',
      contains: [{
        type: 'AnnotationModelOutput',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
