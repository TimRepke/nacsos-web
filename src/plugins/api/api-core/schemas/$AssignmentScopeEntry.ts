/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentScopeEntry = {
  properties: {
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
    first_occurrence: {
      type: 'number',
      isRequired: true,
    },
    identifier: {
      type: 'number',
      isRequired: true,
    },
    assignments: {
      type: 'array',
      contains: {
        type: 'AssignmentInfo',
      },
      isRequired: true,
    },
  },
} as const;
