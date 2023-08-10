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
      type: 'AnnotationFiltersInput',
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
      type: 'AnnotationCollectionDBInput',
      isRequired: true,
    },
    bot_annotations: {
      type: 'array',
      contains: {
        type: 'BotAnnotationModelInput',
      },
      isRequired: true,
    },
  },
} as const;
