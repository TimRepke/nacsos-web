/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Body_save_resolved_annotations_api_annotations_config_resolve__put = {
  properties: {
    settings: {
      type: 'BotMetaResolveBase',
      isRequired: true,
    },
    matrix: {
      type: 'dictionary',
      contains: {
        type: 'dictionary',
        contains: {
          type: 'ResolutionCell',
        },
      },
      isRequired: true,
    },
  },
} as const;
