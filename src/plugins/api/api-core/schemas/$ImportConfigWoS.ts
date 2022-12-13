/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportConfigWoS = {
  properties: {
    filenames: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
