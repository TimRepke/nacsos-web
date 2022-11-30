/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResolutionPayload = {
  properties: {
    name: {
      type: 'string',
      isRequired: true,
    },
    strategy: {
      type: 'Enum',
      isRequired: true,
    },
    filters: {
      type: 'AnnotationFilters',
      isRequired: true,
    },
    ignore_order: {
      type: 'boolean',
      isRequired: true,
    },
    ignore_hierarchy: {
      type: 'boolean',
      isRequired: true,
    },
    collection: {
      type: 'AnnotationCollectionDB',
      isRequired: true,
    },
    bot_annotations: {
      type: 'array',
      contains: {
        type: 'BotAnnotationModel',
      },
      isRequired: true,
    },
  },
} as const;
