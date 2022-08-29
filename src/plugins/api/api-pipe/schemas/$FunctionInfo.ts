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
        type: 'Artefact',
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
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    est_cpu_load: {
      type: 'Enum',
    },
    recommended_lifetime: {
      type: 'number',
    },
  },
} as const;
