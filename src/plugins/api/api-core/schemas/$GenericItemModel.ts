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
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    type: {
      type: 'ItemType',
    },
    text: {
      type: 'string',
    },
    meta: {
      properties: {
      },
      isRequired: true,
    },
  },
} as const;
