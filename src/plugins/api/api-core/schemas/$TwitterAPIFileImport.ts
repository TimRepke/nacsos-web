/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TwitterAPIFileImport = {
  properties: {
    func_name: {
      properties: {
      },
      isRequired: true,
    },
    encoding: {
      properties: {
      },
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    import_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
    },
    filenames: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
