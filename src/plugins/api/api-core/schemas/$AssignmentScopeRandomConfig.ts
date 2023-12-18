/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeRandomConfig = {
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
  },
} as const;
