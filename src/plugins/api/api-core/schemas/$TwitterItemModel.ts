/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TwitterItemModel = {
  description: `Corresponds to db.models.items.TwitterItem

  For more in-depth documentation, please refer to:
  https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet`,
  properties: {
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    type: {
      type: 'ItemType',
    },
    text: {
      type: 'string',
    },
    twitter_id: {
      type: 'string',
    },
    twitter_author_id: {
      type: 'string',
    },
    created_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    language: {
      type: 'string',
    },
    conversation_id: {
      type: 'string',
    },
    referenced_tweets: {
      type: 'array',
      contains: {
        type: 'ReferencedTweet',
      },
    },
    latitude: {
      type: 'number',
    },
    longitude: {
      type: 'number',
    },
    hashtags: {
      type: 'array',
      contains: {
        type: 'Hashtag',
      },
    },
    mentions: {
      type: 'array',
      contains: {
        type: 'Mention',
      },
    },
    urls: {
      type: 'array',
      contains: {
        type: 'URL',
      },
    },
    cashtags: {
      type: 'array',
      contains: {
        type: 'Cashtag',
      },
    },
    annotations: {
      type: 'array',
      contains: {
        type: 'ContextAnnotation',
      },
    },
    retweet_count: {
      type: 'number',
      isRequired: true,
    },
    reply_count: {
      type: 'number',
      isRequired: true,
    },
    like_count: {
      type: 'number',
      isRequired: true,
    },
    quote_count: {
      type: 'number',
      isRequired: true,
    },
    user: {
      type: 'TwitterUserModel',
    },
  },
} as const;
