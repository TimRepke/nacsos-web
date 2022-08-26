/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Flattened and reduced representation of a Twitter User Object
 * https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user
 *
 * NOTE:
 * - In the context of a `TwitterItemModel`, the `id` is not set as it can be inferred from `twitter_author_id`
 * - `name` is None if `name` == `username` to save space
 */
export type TwitterUserModel = {
  id?: string;
  created_at: string;
  name?: string;
  username: string;
  verified: boolean;
  description?: string;
  location?: string;
  followers_count?: number;
  following_count?: number;
  tweet_count?: number;
  listed_count?: number;
};

