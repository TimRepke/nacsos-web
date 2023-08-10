/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TwitterUserModelOutput = {
  description: `
  Flattened and reduced representation of a Twitter User Object
  https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/user

  NOTE:
  - In the context of a \`TwitterItemModel\`, the \`id\` is not set as it can be inferred from \`twitter_author_id\`
  - \`name\` is None if \`name\` == \`username\` to save space
  `,
  properties: {
    id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    created_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    name: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    location: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    followers_count: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    following_count: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    tweet_count: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    listed_count: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
