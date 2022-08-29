/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportConfigJSONL = {
  properties: {
    filenames: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    line_type: {
      type: 'Enum',
      isRequired: true,
    },
  },
} as const;
