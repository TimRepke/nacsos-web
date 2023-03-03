/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TaskModel = {
  properties: {
    task_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    function_name: {
      type: 'string',
      isRequired: true,
    },
    params: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          type: 'any-of',
          contains: [{
            type: 'number',
          }, {
            type: 'number',
          }, {
            type: 'string',
          }, {
            type: 'SerializedArtefactReference',
          }],
        },
      }, {
        type: 'string',
      }],
    },
    user_id: {
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
    comment: {
      type: 'string',
    },
    location: {
      type: 'all-of',
      contains: [{
        type: 'ExecutionLocation',
      }],
    },
    fingerprint: {
      type: 'string',
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
    est_runtime: {
      type: 'number',
    },
    est_memory: {
      type: 'number',
    },
    est_cpu_load: {
      type: 'all-of',
      contains: [{
        type: 'CPULoadClassification',
      }],
    },
    rec_expunge: {
      type: 'string',
      format: 'date-time',
    },
    dependencies: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'array',
        contains: {
          type: 'string',
          format: 'uuid',
        },
      }],
    },
    status: {
      type: 'all-of',
      contains: [{
        type: 'TaskStatus',
      }],
    },
  },
} as const;
