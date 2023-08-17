/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FunctionInfo = {
  properties: {
    module: {
      type: 'string',
      isRequired: true,
    },
    function: {
      type: 'string',
      isRequired: true,
    },
    kwargs: {
      type: 'dictionary',
      contains: {
        type: 'KWARG',
      },
      isRequired: true,
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    docstring: {
      type: 'string',
      isRequired: true,
    },
    artefacts: {
      type: 'dictionary',
      contains: {
        type: 'Artefact_Any_',
      },
      isRequired: true,
    },
    filepath: {
      type: 'string',
      isRequired: true,
    },
    filepath_rel: {
      type: 'string',
      isRequired: true,
    },
    tags: {
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
    est_cpu_load: {
      type: 'all-of',
      contains: [{
        type: 'CPULoadClassification',
      }],
    },
    recommended_lifetime: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
