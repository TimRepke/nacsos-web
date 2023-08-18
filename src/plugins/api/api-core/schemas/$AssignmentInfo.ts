/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AssignmentInfo = {
  properties: {
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
    username: {
      type: 'string',
      isRequired: true,
    },
    order: {
      type: 'number',
      isRequired: true,
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
    status: {
      type: 'AssignmentStatus',
      isRequired: true,
    },
    labels: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          type: 'array',
          contains: {
            type: 'AssignmentInfoLabel',
          },
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
