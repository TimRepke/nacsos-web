/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserProjectAssignmentScope = {
  properties: {
    scope: {
      type: 'AssignmentScopeModelOutput',
      isRequired: true,
    },
    scheme_name: {
      type: 'string',
      isRequired: true,
    },
    scheme_description: {
      type: 'string',
      isRequired: true,
    },
    num_assignments: {
      type: 'number',
      isRequired: true,
    },
    num_open: {
      type: 'number',
      isRequired: true,
    },
    num_partial: {
      type: 'number',
      isRequired: true,
    },
    num_completed: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
