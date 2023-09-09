/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionUserEntry = {
  properties: {
    assignment: {
      type: 'any-of',
      contains: [{
        type: 'DehydratedAssignment',
      }, {
        type: 'null',
      }],
    },
    annotation: {
      type: 'any-of',
      contains: [{
        type: 'AnnotationModel',
      }, {
        type: 'null',
      }],
    },
    status: {
      type: 'all-of',
      contains: [{
        type: 'ResolutionStatus',
      }],
    },
  },
} as const;
