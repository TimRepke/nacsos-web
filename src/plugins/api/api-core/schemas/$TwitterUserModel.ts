/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TwitterUserModel = {
  description: `Flattened and reduced representation of a Twitter User Object
  https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user

  NOTE:
  - In the context of a \`TwitterItemModel\`, the \`id\` is not set as it can be inferred from \`twitter_author_id\`
  - \`name\` is None if \`name\` == \`username\` to save space`,
  properties: {
    id: {
      type: 'string',
    },
    created_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    name: {
      type: 'string',
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    verified: {
      type: 'boolean',
      isRequired: true,
    },
    description: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    followers_count: {
      type: 'number',
    },
    following_count: {
      type: 'number',
    },
    tweet_count: {
      type: 'number',
    },
    listed_count: {
      type: 'number',
    },
  },
} as const;
