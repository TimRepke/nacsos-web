/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DehydratedAssignment = {
  properties: {
    assignment_id: {
      type: 'string',
      isRequired: true,
    },
    user_id: {
      type: 'string',
      isRequired: true,
    },
    item_id: {
      type: 'string',
      isRequired: true,
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    status: {
      type: 'AssignmentStatus',
      isRequired: true,
    },
    order: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
