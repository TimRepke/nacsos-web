/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PipelineTaskStatusFailedEvent = {
  description: `More specific version of \`PipelineTaskStatusChangedEvent\` emitted when a task finished (failed)`,
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
