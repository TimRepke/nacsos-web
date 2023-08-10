/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportModelOutput = {
  properties: {
    import_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    time_started: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    time_finished: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    config: {
      type: 'any-of',
      contains: [{
        type: 'ImportConfigTwitterOutput',
      }, {
        type: 'ImportConfigJSONL',
      }, {
        type: 'ImportConfigWoS',
      }, {
        type: 'ImportConfigScopus',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
