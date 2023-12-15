/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeRandomWithNQLConfig = {
  properties: {
    config_type: {
      type: 'Enum',
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
    query: {
      type: 'any-of',
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
        type: 'MetaFilter',
      }, {
        type: 'SubQuery',
      }],
      isRequired: true,
    },
  },
} as const;
