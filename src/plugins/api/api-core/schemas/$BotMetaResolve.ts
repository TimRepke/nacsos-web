/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BotMetaResolve = {
  properties: {
    algorithm: {
      type: 'Enum',
      isRequired: true,
    },
    filters: {
      type: 'AnnotationFiltersOutput',
      isRequired: true,
    },
    ignore_hierarchy: {
      type: 'boolean',
      isRequired: true,
    },
    ignore_repeat: {
      type: 'boolean',
      isRequired: true,
    },
    trust: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    collection: {
      type: 'AnnotationCollectionDBOutput',
      isRequired: true,
    },
  },
} as const;
