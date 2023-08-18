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
      }, {
        type: 'null',
      }],
    },
    function_name: {
      type: 'string',
      isRequired: true,
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    comment: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    location: {
      type: 'all-of',
      contains: [{
        type: 'ExecutionLocation',
      }],
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
      }, {
        type: 'null',
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
      }, {
        type: 'null',
      }],
    },
  },
} as const;
