/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TaskInDB = {
  properties: {
    task_id: {
      type: 'string',
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
            type: 'ArtefactReference',
          }],
        },
      }, {
        type: 'string',
      }],
    },
    user_id: {
      type: 'string',
    },
    project_id: {
      type: 'string',
    },
    comment: {
      type: 'string',
    },
    location: {
      type: 'Enum',
    },
    fingerprint: {
      type: 'string',
      isRequired: true,
    },
    dt_submitted: {
      type: 'string',
      format: 'date-time',
    },
    dt_started: {
      type: 'string',
      format: 'date-time',
    },
    dt_finished: {
      type: 'string',
      format: 'date-time',
    },
    dt_cancelled: {
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
      type: 'Enum',
    },
    rec_expunge: {
      type: 'string',
      format: 'date-time',
    },
    dependencies: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    status: {
      type: 'Enum',
    },
  },
} as const;
