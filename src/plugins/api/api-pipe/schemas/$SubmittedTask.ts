/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubmittedTask = {
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
    force_run: {
      type: 'boolean',
    },
    forced_dependencies: {
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
  },
} as const;
