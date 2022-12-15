/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Event = {
  properties: {
    event: {
      type: 'Enum',
      isRequired: true,
    },
    payload: {
      type: 'any-of',
      contains: [{
        type: 'PipelineTaskStatusChangedEvent',
      }, {
        type: 'PipelineTaskStatusFailedEvent',
      }, {
        type: 'PipelineTaskStatusCompletedEvent',
      }, {
        type: 'PipelineTaskStatusStartedEvent',
      }],
      isRequired: true,
    },
  },
} as const;
