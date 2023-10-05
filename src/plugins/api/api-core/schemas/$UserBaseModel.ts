/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserBaseModel = {
  description: `User represents a person.
  Most entries in the database will be (indirectly) linked to user accounts, so this is
  at the core of access management and ownership.`,
  properties: {
    user_id: {
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
    username: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    email: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'email',
      }, {
        type: 'null',
      }],
    },
    full_name: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    affiliation: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    is_superuser: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
      }, {
        type: 'null',
      }],
    },
    is_active: {
      type: 'any-of',
      contains: [{
        type: 'boolean',
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
    time_updated: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
