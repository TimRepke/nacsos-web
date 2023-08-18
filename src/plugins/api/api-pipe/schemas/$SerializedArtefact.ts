/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SerializedArtefact = {
  description: `
  The SerializedArtefact is the interface definition on how references to artefacts
  are communicated. It is essentially just a proxy for \`Artefact\`.
  `,
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
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
