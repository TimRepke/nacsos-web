/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * More specific version of `PipelineTaskStatusChangedEvent` emitted when a task started
 */
export type PipelineTaskStatusStartedEvent = {
  task_id: string;
  status: PipelineTaskStatusStartedEvent.status;
  project_id: string;
  user_id: string;
  import_id?: string;
  function_name: string;
};

export namespace PipelineTaskStatusStartedEvent {

  export enum status {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
  }


}

