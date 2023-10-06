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
      }, {
        type: 'null',
      }],
    },
    project_id: {
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
    type: {
      type: 'all-of',
      contains: [{
        type: 'ItemType',
      }],
    },
    text: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    twitter_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    twitter_author_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    created_at: {
      type: 'string',
      isRequired: true,
      format: 'date-time',
    },
    language: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    conversation_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    referenced_tweets: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'ReferencedTweet',
        },
      }, {
        type: 'null',
      }],
    },
    latitude: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    longitude: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
    },
    hashtags: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'Hashtag',
        },
      }, {
        type: 'null',
      }],
    },
    mentions: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'Mention',
        },
      }, {
        type: 'null',
      }],
    },
    urls: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'URL',
        },
      }, {
        type: 'null',
      }],
    },
    cashtags: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'Cashtag',
        },
      }, {
        type: 'null',
      }],
    },
    context_annotations: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'ContextAnnotation',
        },
      }, {
        type: 'null',
      }],
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
      type: 'any-of',
      contains: [{
        type: 'TwitterUserModel',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
