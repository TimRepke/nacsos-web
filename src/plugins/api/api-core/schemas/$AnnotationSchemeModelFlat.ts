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
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_updated: {
      type: 'string',
      format: 'date-time',
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
