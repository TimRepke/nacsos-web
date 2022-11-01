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
      type: 'AnnotationFilters',
      isRequired: true,
    },
    matrix: {
      type: 'AnnotationMatrix',
      isRequired: true,
    },
    trust: {
      type: 'dictionary',
      contains: {
        type: 'number',
      },
    },
  },
} as const;
