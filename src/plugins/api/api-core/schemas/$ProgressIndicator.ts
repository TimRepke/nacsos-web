/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProgressIndicator = {
  properties: {
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
    order: {
      type: 'number',
      isRequired: true,
    },
    status: {
      type: 'AssignmentStatus',
      isRequired: true,
    },
    labels: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'ProgressIndicatorLabel',
        },
      },
    },
  },
} as const;
