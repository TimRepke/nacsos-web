/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemModel = {
  description: `Corresponds to db.models.items.Item`,
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
    text: {
      type: 'string',
      isRequired: true,
    },
    meta: {
      properties: {
      },
      isRequired: true,
    },
  },
} as const;
