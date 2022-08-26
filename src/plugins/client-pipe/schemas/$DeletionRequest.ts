/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DeletionRequest = {
  properties: {
    task_id: {
      type: 'string',
      isRequired: true,
    },
    files: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
