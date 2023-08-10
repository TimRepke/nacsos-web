/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectBaseInfo = {
  properties: {
    users: {
      type: 'array',
      contains: {
        type: 'ProjectBaseInfoEntry',
      },
      isRequired: true,
    },
    scopes: {
      type: 'array',
      contains: {
        type: 'ProjectBaseInfoScopeEntry',
      },
      isRequired: true,
    },
    bot_scopes: {
      type: 'array',
      contains: {
        type: 'ProjectBaseInfoEntry',
      },
      isRequired: true,
    },
    labels: {
      type: 'dictionary',
      contains: {
        type: 'LabelOptions',
      },
      isRequired: true,
    },
    fields: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
