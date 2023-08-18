/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ImportModel = {
  properties: {
    import_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
      isRequired: true,
    },
    pipeline_task_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'string',
      isRequired: true,
    },
    type: {
      type: 'string',
      isRequired: true,
    },
    time_created: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    time_started: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    time_finished: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    config: {
      type: 'any-of',
      contains: [{
        type: 'one-of',
        contains: [{
          type: 'TwitterDBFileImport',
        }, {
          type: 'TwitterAPIFileImport',
        }, {
          type: 'ImportConfigTwitter',
        }, {
          type: 'OpenAlexImport',
        }, {
          type: 'WOSImport',
        }, {
          type: 'OpenAlexItemImport',
        }, {
          type: 'AcademicItemImport',
        }, {
          type: 'ScopusCSVImport',
        }],
      }, {
        type: 'null',
      }],
    },
  },
} as const;
