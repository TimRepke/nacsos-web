/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FlattenedAnnotationSchemeLabel = {
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
      isRequired: true,
    },
    key: {
      type: 'string',
      isRequired: true,
    },
    required: {
      type: 'boolean',
      isRequired: true,
    },
    max_repeat: {
      type: 'number',
      isRequired: true,
    },
    implicit_max_repeat: {
      type: 'number',
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
          type: 'AnnotationSchemeLabelChoiceFlat',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    parent_label: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    parent_choice: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
