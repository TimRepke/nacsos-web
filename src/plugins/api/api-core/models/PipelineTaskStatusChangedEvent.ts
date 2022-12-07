/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Emitted when the pipeline service calls the nacsos-core API and tells it about a status change of a task
 */
export type PipelineTaskStatusChangedEvent = {
  task_id: string;
  status: PipelineTaskStatusChangedEvent.status;
  project_id: string;
  user_id: string;
  import_id?: string;
  function_name: string;
};

export namespace PipelineTaskStatusChangedEvent {

  export enum status {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
  }


}

