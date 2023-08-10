/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationItem = {
  properties: {
    scheme: {
      type: 'AnnotationSchemeModelOutput',
      isRequired: true,
    },
    assignment: {
      type: 'AssignmentModelOutput',
      isRequired: true,
    },
    scope: {
      type: 'AssignmentScopeModelOutput',
      isRequired: true,
    },
    item: {
      type: 'any-of',
      contains: [{
        type: 'TwitterItemModelOutput',
      }, {
        type: 'AcademicItemModel',
      }, {
        type: 'GenericItemModel',
      }],
      isRequired: true,
    },
  },
} as const;
