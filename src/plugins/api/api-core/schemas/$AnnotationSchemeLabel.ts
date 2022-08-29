/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeLabel = {
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
      type: 'string',
    },
    max_repeat: {
      type: 'number',
    },
    required: {
      type: 'boolean',
    },
    kind: {
      type: 'Enum',
    },
    choices: {
      type: 'array',
      contains: {
        type: 'AnnotationSchemeLabelChoice',
      },
    },
    annotation: {
      type: 'AnnotationModel',
    },
  },
} as const;
