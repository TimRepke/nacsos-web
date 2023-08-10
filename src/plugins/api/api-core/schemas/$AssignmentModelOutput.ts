/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentModelOutput = {
  description: `
  Corresponds to db.models.annotations.Assignment

  Assignment is used to request a user/annotator (User) to annotate a particular item (BaseItem) in the database
  following a pre-defined annotation scheme (AnnotationScheme).

  Each AnnotationScheme will have several Assignments.
  Each User will "receive" several Assignments.
  Each Item may have several Assignments (either in relation to different AnnotationSchemes or double-coding).
  The Project is implicit by the AnnotationScheme.

  The most common use-cases are:
   * Creating assignments in bulk at random (e.g. 3 users should annotate 50 documents each)
   * Creating assignments one at a time based on a set of rules (e.g. for double-coding, defined order, bias, ...)
   * Creating assignments in small batches or one-by-one in prioritised annotation settings
  `,
  properties: {
    assignment_id: {
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
    assignment_scope_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
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
    status: {
      type: 'AssignmentStatus',
      isRequired: true,
    },
    order: {
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
