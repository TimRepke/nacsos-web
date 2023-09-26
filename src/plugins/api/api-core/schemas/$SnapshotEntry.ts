/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SnapshotEntry = {
  properties: {
    value_bool: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    value_int: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    value_float: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    value_str: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    multi_int: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
    },
    order_key: {
      type: 'string',
      isRequired: true,
    },
    path_key: {
      type: 'string',
      isRequired: true,
    },
    item_id: {
      type: 'string',
      isRequired: true,
    },
    anno_id: {
      type: 'string',
      isRequired: true,
    },
    user_id: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
