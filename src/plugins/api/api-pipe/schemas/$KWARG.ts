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
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
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
      }, {
        type: 'null',
      }],
    },
    artefact: {
      type: 'any-of',
      contains: [{
        type: 'SerializedArtefact',
      }, {
        type: 'null',
      }],
    },
    params: {
      type: 'any-of',
      contains: [{
        type: 'dictionary',
        contains: {
          type: 'KWARG',
        },
      }, {
        type: 'null',
      }],
    },
    options: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    generics: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
