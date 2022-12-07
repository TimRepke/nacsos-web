/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationModel = {
  description: `Corresponds to db.models.annotations.Annotation

  Annotation holds the judgement of a User for a specific Item in the context of an AnnotationScheme
  as a response to an Assignment.
  Once an Annotation exists, the Assignment should be considered (partially) resolved.

  Note, that AnnotationScheme, User, and Item would be implicit by the Assignment.
  However, for ease of use and in favour of fewer joins, this information is replicated here.

  The Annotation refers to an AnnotationSchemeLabel defined in an AnnotationScheme, which is referred to by its \`key\`.
  If the scheme allows the user to make repeated annotations for the same Label (\`key\`),
  an offset is defined in \`repeat\` (e.g. for primary technology is "natural tech", secondary is "forests").

  Furthermore, in-text annotations refer to a substring in the Item text, for which the optional fields
  \`text_offset_start\` and \`text_offset_end\` can be used.

  Note, that there is no database constraints on the completeness of an Assignment/AnnotationScheme.
  The interface/backend code should be used to make sure, to either not allow partial fulfillment of an
  AnnotationScheme or not display an Assignment as complete.`,
  properties: {
    annotation_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_updated: {
      type: 'string',
      format: 'date-time',
    },
    assignment_id: {
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
    key: {
      type: 'string',
      isRequired: true,
    },
    repeat: {
      type: 'number',
    },
    parent: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    value_bool: {
      type: 'boolean',
    },
    value_int: {
      type: 'number',
    },
    value_float: {
      type: 'number',
    },
    value_str: {
      type: 'string',
    },
    multi_int: {
      type: 'array',
      contains: {
        type: 'number',
      },
    },
    text_offset_start: {
      type: 'number',
    },
    text_offset_stop: {
      type: 'number',
    },
  },
} as const;
