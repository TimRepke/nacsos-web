/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MakeAssignmentsRequestModel = {
  properties: {
    annotation_scheme_id: {
      type: 'string',
      isRequired: true,
    },
    scope_id: {
      type: 'string',
      isRequired: true,
    },
    config: {
      type: 'any-of',
      contains: [{
        type: 'AssignmentScopeRandomWithExclusionConfigInput',
      }, {
        type: 'AssignmentScopeRandomConfigInput',
      }],
      isRequired: true,
    },
    save: {
      type: 'boolean',
    },
  },
} as const;
