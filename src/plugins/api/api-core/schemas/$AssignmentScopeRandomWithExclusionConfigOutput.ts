/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeRandomWithExclusionConfigOutput = {
  properties: {
    config_type: {
      type: 'Enum',
      isRequired: true,
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
      isRequired: true,
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
    excluded_scopes: {
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
      }],
      isRequired: true,
    },
  },
} as const;
