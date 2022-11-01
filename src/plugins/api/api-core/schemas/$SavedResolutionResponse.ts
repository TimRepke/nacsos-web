/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SavedResolutionResponse = {
  properties: {
    bot_annotation_metadata_id: {
      type: 'string',
      isRequired: true,
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    project_id: {
      type: 'string',
      isRequired: true,
    },
    annotation_scope_id: {
      type: 'string',
    },
    annotation_scheme_id: {
      type: 'string',
    },
    meta: {
      type: 'BotMetaResolve',
      isRequired: true,
    },
    saved: {
      type: 'array',
      contains: {
        type: 'BotAnnotationModel',
      },
      isRequired: true,
    },
  },
} as const;
