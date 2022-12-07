/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SerializedArtefact = {
  properties: {
    serializer: {
      type: 'string',
      isRequired: true,
    },
    dtype: {
      type: 'string',
      isRequired: true,
    },
    filename: {
      type: 'string',
      isRequired: true,
    },
    filenames: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }],
      isRequired: true,
    },
  },
} as const;
