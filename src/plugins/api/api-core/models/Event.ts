/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PipelineTaskStatusChangedEvent } from './PipelineTaskStatusChangedEvent';
import type { PipelineTaskStatusCompletedEvent } from './PipelineTaskStatusCompletedEvent';
import type { PipelineTaskStatusFailedEvent } from './PipelineTaskStatusFailedEvent';
import type { PipelineTaskStatusStartedEvent } from './PipelineTaskStatusStartedEvent';

export type Event = {
  event: Event.event;
  payload: (PipelineTaskStatusChangedEvent | PipelineTaskStatusCompletedEvent | PipelineTaskStatusStartedEvent | PipelineTaskStatusFailedEvent);
};

export namespace Event {

  export enum event {
    PIPELINE_TASK_STATUS_CHANGED_EVENT = 'PipelineTaskStatusChangedEvent',
    PIPELINE_TASK_STATUS_COMPLETED_EVENT = 'PipelineTaskStatusCompletedEvent',
    PIPELINE_TASK_STATUS_STARTED_EVENT = 'PipelineTaskStatusStartedEvent',
    PIPELINE_TASK_STATUS_FAILED_EVENT = 'PipelineTaskStatusFailedEvent',
  }


}

