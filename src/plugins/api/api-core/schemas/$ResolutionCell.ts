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
      type: 'any-of',
      contains: [{
        type: 'BotAnnotationModel',
      }, {
        type: 'null',
      }],
    },
    status: {
      type: 'all-of',
      contains: [{
        type: 'ResolutionStatus',
      }],
    },
  },
} as const;
