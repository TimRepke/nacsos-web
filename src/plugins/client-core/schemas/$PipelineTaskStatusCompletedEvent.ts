/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PipelineTaskStatusCompletedEvent = {
  description: `More specific version of \`PipelineTaskStatusChangedEvent\` emitted when a task finished (successfully/completed)`,
  properties: {
    task_id: {
      type: 'string',
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
    project_id: {
      type: 'string',
      isRequired: true,
    },
    user_id: {
      type: 'string',
      isRequired: true,
    },
    import_id: {
      type: 'string',
    },
    function_name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
