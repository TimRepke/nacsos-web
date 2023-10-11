/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationItem = {
  properties: {
    scheme: {
      type: 'AnnotationSchemeModel',
      isRequired: true,
    },
    assignment: {
      type: 'AssignmentModel',
      isRequired: true,
    },
    scope: {
      type: 'AssignmentScopeModel',
      isRequired: true,
    },
    item: {
      type: 'any-of',
      contains: [{
        type: 'TwitterItemModel',
      }, {
        type: 'AcademicItemModel',
      }, {
        type: 'LexisNexisItemModel',
      }, {
        type: 'FullLexisNexisItemModel',
      }, {
        type: 'GenericItemModel',
      }],
      isRequired: true,
    },
  },
} as const;
