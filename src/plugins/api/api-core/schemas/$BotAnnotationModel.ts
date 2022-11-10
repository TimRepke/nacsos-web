/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BotAnnotationModel = {
  properties: {
    bot_annotation_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    bot_annotation_metadata_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_updated: {
      type: 'string',
      format: 'date-time',
    },
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    parent: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    key: {
      type: 'string',
    },
    repeat: {
      type: 'number',
    },
    value_bool: {
      type: 'boolean',
    },
    value_int: {
      type: 'number',
    },
    value_float: {
      type: 'number',
    },
    value_str: {
      type: 'string',
    },
    multi_int: {
      type: 'array',
      contains: {
        type: 'number',
      },
    },
    confidence: {
      type: 'number',
    },
  },
} as const;
