/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserInDBModel = {
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
      }],
    },
    username: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    full_name: {
      type: 'string',
    },
    affiliation: {
      type: 'string',
    },
    is_superuser: {
      type: 'boolean',
    },
    is_active: {
      type: 'boolean',
    },
    time_created: {
      type: 'string',
      format: 'date-time',
    },
    time_updated: {
      type: 'string',
      format: 'date-time',
    },
    password: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
