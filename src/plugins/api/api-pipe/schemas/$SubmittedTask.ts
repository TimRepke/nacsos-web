/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubmittedTask = {
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
    force_run: {
      type: 'boolean',
    },
    forced_dependencies: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
  },
} as const;
