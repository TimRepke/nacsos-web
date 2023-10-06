/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DehydratedAnnotationTracker = {
  properties: {
    annotation_tracking_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
