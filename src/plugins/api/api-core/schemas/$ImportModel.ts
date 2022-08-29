/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportModel = {
  properties: {
    import_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
      isRequired: true,
    },
    pipeline_task_id: {
      type: 'string',
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'string',
      isRequired: true,
    },
    type: {
      type: 'any-of',
      contains: [{
        type: 'Enum',
      }, {
        type: 'ImportType',
      }],
      isRequired: true,
    },
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_started: {
      type: 'string',
      format: 'date-time',
    },
    time_finished: {
      type: 'string',
      format: 'date-time',
    },
    config: {
      type: 'any-of',
      contains: [{
        type: 'ImportConfigRIS',
      }, {
        type: 'ImportConfigTwitter',
      }, {
        type: 'ImportConfigJSONL',
      }],
    },
  },
} as const;
