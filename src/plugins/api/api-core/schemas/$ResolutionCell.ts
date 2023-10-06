/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionCell = {
  properties: {
    labels: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'ResolutionUserEntry',
        },
      },
      isRequired: true,
    },
    resolution: {
      type: 'BotAnnotationModel',
      isRequired: true,
    },
    status: {
      type: 'all-of',
      contains: [{
        type: 'ResolutionStatus',
      }],
    },
  },
} as const;
