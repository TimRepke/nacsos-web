/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FlattenedAnnotationSchemeLabel = {
  properties: {
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
        type: 'number',
      },
    },
    parent_label: {
      type: 'string',
    },
  },
} as const;
