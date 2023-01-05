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
        type: 'PipelineTaskStatusFailedEvent',
      }, {
        type: 'PipelineTaskStatusChangedEvent',
      }, {
        type: 'PipelineTaskStatusCompletedEvent',
      }, {
        type: 'PipelineTaskStatusCompletedEvent',
      }],
      isRequired: true,
    },
  },
} as const;
