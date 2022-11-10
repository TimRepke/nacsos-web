/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AcademicItemModel = {
  description: `Corresponds to db.schema.items.academic.AcademicItem`,
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
      isRequired: true,
    },
  },
} as const;
