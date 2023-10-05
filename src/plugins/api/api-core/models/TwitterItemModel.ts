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
  item_id?: (string | null);
  project_id?: (string | null);
  type?: ItemType;
  text?: (string | null);
  twitter_id?: (string | null);
  twitter_author_id?: (string | null);
  created_at: string;
  language?: (string | null);
  conversation_id?: (string | null);
  referenced_tweets?: (Array<ReferencedTweet> | null);
  latitude?: (number | null);
  longitude?: (number | null);
  hashtags?: (Array<Hashtag> | null);
  mentions?: (Array<Mention> | null);
  urls?: (Array<URL> | null);
  cashtags?: (Array<Cashtag> | null);
  context_annotations?: (Array<ContextAnnotation> | null);
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  user?: (TwitterUserModel | null);
};

