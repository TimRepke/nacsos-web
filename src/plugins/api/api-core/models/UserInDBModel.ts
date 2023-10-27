/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserInDBModel = {
  user_id?: (string | null);
  username?: (string | null);
  full_name?: (string | null);
  email?: (string | null);
  affiliation?: (string | null);
  is_superuser?: (boolean | null);
  is_active?: (boolean | null);
  time_created?: (string | null);
  time_updated?: (string | null);
  password: string;
};

