/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 *
 * Flattened and reduced representation of a Twitter User Object
 * https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user
 *
 * NOTE:
 * - In the context of a `TwitterItemModel`, the `id` is not set as it can be inferred from `twitter_author_id`
 * - `name` is None if `name` == `username` to save space
 *
 */
export type TwitterUserModelOutput = {
  id: (string | null);
  created_at: string;
  name: (string | null);
  username: string;
  verified: boolean;
  description: (string | null);
  location: (string | null);
  followers_count: (number | null);
  following_count: (number | null);
  tweet_count: (number | null);
  listed_count: (number | null);
};

