/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectInfo = {
  properties: {
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
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
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
    type: {
      type: 'any-of',
      contains: [{
        type: 'Enum',
      }, {
        type: 'ItemType',
      }],
      isRequired: true,
    },
    setting_motivational_quotes: {
      type: 'boolean',
    },
    owners: {
      type: 'array',
      contains: {
        type: 'UserBaseModel',
      },
      isRequired: true,
    },
  },
} as const;
