/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationSchemeModel = {
  description: `
  Corresponds to db.models.annotations.AnnotationScheme

  AnnotationScheme defines the annotation scheme for a particular project.
  Each project may have multiple AnnotationSchemes,
  but projects cannot share the same scheme. In case they are technically the same,
  the user would have to create a new copy of that scheme for a different project.

  The actual annotation scheme is defined as a list of labels (see schemas.annotations.AnnotationSchemeLabel).
  The other fields pose as meta-data.
  `,
  properties: {
    annotation_scheme_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    time_created: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    time_updated: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    labels: {
      type: 'array',
      contains: {
        type: 'AnnotationSchemeLabel',
      },
      isRequired: true,
    },
  },
} as const;
