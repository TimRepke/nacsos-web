/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GenericItemModel = {
  description: `Corresponds to db.models.items.generic.GenericItem`,
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
    meta: {
      properties: {
      },
      isRequired: true,
    },
  },
} as const;
