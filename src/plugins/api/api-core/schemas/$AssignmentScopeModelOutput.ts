/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeModelOutput = {
  description: `
  AssignmentScope can be used to logically group a set of Assignments.
  For example, one may wish to re-use the same AnnotationScheme several times within a project
  without copying it each time. It may also be used to logically group different scopes of
  the annotation process, for example to make it clear that different subsets of a dataset
  are to be annotated.
  Logically, this should be viewed as a hierarchical organisation
  AnnotationScheme -> [AssignmentScope] -> Assignment -> Annotation
  `,
  properties: {
    assignment_scope_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    annotation_scheme_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    time_created: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      isRequired: true,
    },
    config: {
      type: 'any-of',
      contains: [{
        type: 'AssignmentScopeRandomWithExclusionConfigOutput',
      }, {
        type: 'AssignmentScopeRandomConfigOutput',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    highlighter_ids: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'array',
        contains: {
          type: 'string',
          format: 'uuid',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
