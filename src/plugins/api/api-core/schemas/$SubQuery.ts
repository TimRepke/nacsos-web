/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubQuery = {
  properties: {
    filter: {
      properties: {
      },
    },
    and_: {
      type: 'any-of',
      contains: [{
        type: 'null',
      }],
    },
    or_: {
      type: 'any-of',
      contains: [{
        type: 'null',
      }],
    },
    not_: {
      type: 'any-of',
      contains: [{
        type: 'one-of',
        contains: [{
          type: 'FieldFilter',
        }, {
          type: 'FieldFilters',
        }, {
          type: 'LabelFilterMulti',
        }, {
          type: 'LabelFilterBool',
        }, {
          type: 'LabelFilterInt',
        }, {
          type: 'AssignmentFilter',
        }, {
          type: 'AnnotationFilter',
        }, {
          type: 'ImportFilter',
        }, {
          type: 'MetaFilterBool',
        }, {
          type: 'MetaFilterInt',
        }, {
          type: 'MetaFilterStr',
        }, {
          type: 'SubQuery',
        }],
      }, {
        type: 'null',
      }],
    },
  },
} as const;
