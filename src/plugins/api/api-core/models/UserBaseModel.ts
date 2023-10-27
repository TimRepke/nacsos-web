/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * User represents a person.
 * Most entries in the database will be (indirectly) linked to user accounts, so this is
 * at the core of access management and ownership.
 */
export type UserBaseModel = {
  user_id?: (string | null);
  username?: (string | null);
  full_name?: (string | null);
  email?: (string | null);
  affiliation?: (string | null);
  is_superuser?: (boolean | null);
  is_active?: (boolean | null);
  time_created?: (string | null);
  time_updated?: (string | null);
};

