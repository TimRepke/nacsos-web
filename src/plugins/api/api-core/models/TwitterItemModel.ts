/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Cashtag } from './Cashtag';
import type { ContextAnnotation } from './ContextAnnotation';
import type { Hashtag } from './Hashtag';
import type { ItemType } from './ItemType';
import type { Mention } from './Mention';
import type { ReferencedTweet } from './ReferencedTweet';
import type { TwitterUserModel } from './TwitterUserModel';
import type { URL } from './URL';

/**
 * Corresponds to db.models.items.TwitterItem
 *
 * For more in-depth documentation, please refer to:
 * https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/tweet
 */
export type TwitterItemModel = {
  item_id?: string;
  project_id?: string;
  type?: ItemType;
  text?: string;
  twitter_id?: string;
  twitter_author_id?: string;
  created_at: string;
  language?: string;
  conversation_id?: string;
  referenced_tweets?: Array<ReferencedTweet>;
  latitude?: number;
  longitude?: number;
  hashtags?: Array<Hashtag>;
  mentions?: Array<Mention>;
  urls?: Array<URL>;
  cashtags?: Array<Cashtag>;
  annotations?: Array<ContextAnnotation>;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  user?: TwitterUserModel;
};

