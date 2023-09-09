/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Label = {
  description: `
  Convenience type (corresponding to internal type in db annotation_label).
  For Annotation or BotAnnotation, this is the combination of their respective key, repeat value.

  Mainly used during resolving annotations.
  `,
  properties: {
    key: {
      type: 'string',
      isRequired: true,
    },
    repeat: {
      type: 'number',
      isRequired: true,
    },
    value: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
