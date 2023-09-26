/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BotMetaResolveBase = {
  properties: {
    algorithm: {
      type: 'Enum',
      isRequired: true,
    },
    filters: {
      type: 'AnnotationFilters',
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
    },
  },
} as const;