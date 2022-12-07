/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PipelineTaskStatusChangedEvent = {
  description: `Emitted when the pipeline service calls the nacsos-core API and tells it about a status change of a task`,
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
