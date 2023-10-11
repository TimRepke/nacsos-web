/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FullLexisNexisItemModel = {
  properties: {
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    type: {
      type: 'all-of',
      contains: [{
        type: 'ItemType',
      }],
    },
    text: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    teaser: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    authors: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    sources: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'LexisNexisItemSourceModel',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
