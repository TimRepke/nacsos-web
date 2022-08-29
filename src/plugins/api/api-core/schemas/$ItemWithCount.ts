/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ItemWithCount = {
  properties: {
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
      isRequired: true,
    },
    num_total: {
      type: 'number',
      isRequired: true,
    },
    num_open: {
      type: 'number',
      isRequired: true,
    },
    num_partial: {
      type: 'number',
      isRequired: true,
    },
    num_full: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
