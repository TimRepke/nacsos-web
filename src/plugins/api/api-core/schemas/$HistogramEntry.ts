/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HistogramEntry = {
  properties: {
    bucket: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    num_items: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
