/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * More specific version of `PipelineTaskStatusChangedEvent` emitted when a task finished (failed)
 */
export type PipelineTaskStatusFailedEvent = {
  task_id: string;
  status: PipelineTaskStatusFailedEvent.status;
  project_id: string;
  user_id: string;
  import_id?: string;
  function_name: string;
};

export namespace PipelineTaskStatusFailedEvent {

  export enum status {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
  }


}

