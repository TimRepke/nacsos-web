/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TwitterItemModelOutput = {
  description: `
  Corresponds to db.models.items.TwitterItem

  For more in-depth documentation, please refer to:
  https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet
  `,
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
      isRequired: true,
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
      isRequired: true,
    },
    type: {
      type: 'all-of',
      contains: [{
        type: 'ItemType',
      }],
      isRequired: true,
    },
    text: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    twitter_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    twitter_author_id: {
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
    language: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    conversation_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      isRequired: true,
    },
    latitude: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    longitude: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'null',
      }],
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
        type: 'TwitterUserModelOutput',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
  },
} as const;
