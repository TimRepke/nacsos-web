/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SavedResolutionResponse = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    meta: {
      type: 'BotMetaResolve',
      isRequired: true,
    },
    saved: {
      type: 'dictionary',
      contains: {
        type: 'array',
        contains: {
          type: 'array',
          contains: {
            properties: {
            },
          },
        },
      },
      isRequired: true,
    },
  },
} as const;