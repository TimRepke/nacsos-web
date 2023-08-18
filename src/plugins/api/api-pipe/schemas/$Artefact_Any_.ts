/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Artefact_Any_ = {
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
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
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
      }, {
        type: 'null',
      }],
    },
    fn_resolved: {
      type: 'boolean',
    },
  },
} as const;
