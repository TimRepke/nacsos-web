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
    value_bool: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    value_int: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    value_float: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    value_str: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    multi_int: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
    },
    annotation_id: {
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
      }, {
        type: 'null',
      }],
    },
    text_offset_start: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    text_offset_stop: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
