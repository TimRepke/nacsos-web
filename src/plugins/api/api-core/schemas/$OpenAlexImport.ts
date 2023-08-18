/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $OpenAlexImport = {
  properties: {
    func_name: {
      properties: {
      },
      isRequired: true,
    },
    query: {
      type: 'string',
      isRequired: true,
    },
    def_type: {
      type: 'Enum',
    },
    field: {
      type: 'Enum',
    },
    op: {
      type: 'Enum',
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    import_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
