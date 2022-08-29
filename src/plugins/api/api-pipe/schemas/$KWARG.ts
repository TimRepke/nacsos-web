/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $KWARG = {
  properties: {
    dtype: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    optional: {
      type: 'boolean',
    },
    default: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'number',
      }, {
        type: 'boolean',
      }, {
        type: 'string',
      }],
    },
    artefact: {
      type: 'SerializedArtefact',
    },
    params: {
      type: 'dictionary',
      contains: {
        type: 'KWARG',
      },
    },
    options: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    generics: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
  },
} as const;
