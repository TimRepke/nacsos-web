/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeRandomWithNQLConfig = {
  properties: {
    config_type: {
      properties: {
      },
    },
    users: {
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
    },
    num_items: {
      type: 'number',
      isRequired: true,
    },
    min_assignments_per_item: {
      type: 'number',
      isRequired: true,
    },
    max_assignments_per_item: {
      type: 'number',
      isRequired: true,
    },
    num_multi_coded_items: {
      type: 'number',
      isRequired: true,
    },
    random_seed: {
      type: 'number',
      isRequired: true,
    },
    query_parsed: {
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
      isRequired: true,
    },
    query_str: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
