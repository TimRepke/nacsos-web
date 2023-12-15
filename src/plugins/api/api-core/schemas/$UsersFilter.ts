/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UsersFilter = {
  properties: {
    user_ids: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    mode: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const;
