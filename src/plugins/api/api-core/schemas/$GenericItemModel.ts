/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GenericItemModel = {
  description: `
  Corresponds to db.models.items.generic.GenericItem
  `,
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
      isRequired: true,
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
      isRequired: true,
    },
    type: {
      type: 'all-of',
      contains: [{
        type: 'ItemType',
      }],
      isRequired: true,
    },
    text: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    meta: {
      properties: {
      },
      isRequired: true,
    },
  },
} as const;
