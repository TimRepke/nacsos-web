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
      type: 'string',
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
      type: 'array',
      contains: {
        type: 'AnnotationSchemeLabelChoiceFlat',
      },
    },
    parent_label: {
      type: 'string',
    },
    parent_choice: {
      type: 'number',
    },
  },
} as const;
