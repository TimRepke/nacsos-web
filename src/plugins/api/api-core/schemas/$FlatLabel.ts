/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FlatLabel = {
  properties: {
    path: {
      type: 'array',
      contains: {
        type: 'Label',
      },
      isRequired: true,
    },
    repeat: {
      type: 'number',
      isRequired: true,
    },
    path_key: {
      type: 'string',
      isRequired: true,
    },
    parent_int: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    parent_key: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    parent_value: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    hint: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    key: {
      type: 'string',
      isRequired: true,
    },
    required: {
      type: 'boolean',
      isRequired: true,
    },
    max_repeat: {
      type: 'number',
      isRequired: true,
    },
    kind: {
      type: 'Enum',
      isRequired: true,
    },
    choices: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'FlatLabelChoice',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
