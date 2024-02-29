/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExportRequest = {
  properties: {
    labels: {
      type: 'array',
      contains: {
        type: 'LabelOptions',
      },
      isRequired: true,
    },
    nql_filter: {
      type: 'any-of',
      contains: [{
        type: 'one-of',
        contains: [{
          type: 'FieldFilter',
        }, {
          type: 'FieldFilters',
        }, {
          type: 'LabelFilterMulti',
        }, {
          type: 'LabelFilterBool',
        }, {
          type: 'LabelFilterInt',
        }, {
          type: 'AssignmentFilter',
        }, {
          type: 'AnnotationFilter',
        }, {
          type: 'ImportFilter',
        }, {
          type: 'MetaFilterBool',
        }, {
          type: 'MetaFilterInt',
        }, {
          type: 'MetaFilterStr',
        }, {
          type: 'SubQuery',
        }],
      }, {
        type: 'null',
      }],
    },
    bot_annotation_metadata_ids: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    assignment_scope_ids: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    user_ids: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    ignore_hierarchy: {
      type: 'boolean',
    },
    ignore_repeat: {
      type: 'boolean',
    },
  },
} as const;
