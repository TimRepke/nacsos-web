/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeModelFlat = {
  description: `Same as AnnotationSchemeModel but with flattened structure.`,
  properties: {
    annotation_scheme_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'string',
    },
    labels: {
      type: 'array',
      contains: {
        type: 'FlattenedAnnotationSchemeLabel',
      },
      isRequired: true,
    },
  },
} as const;
