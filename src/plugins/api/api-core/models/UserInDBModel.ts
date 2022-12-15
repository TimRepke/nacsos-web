/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * User represents a person.
 * Most entries in the database will be (indirectly) linked to user accounts, so this is
 * at the core of access management and ownership.
 */
export type UserInDBModel = {
  user_id?: string;
  username?: string;
  email?: string;
  full_name?: string;
  affiliation?: string;
  is_superuser?: boolean;
  is_active?: boolean;
  password: string;
};

