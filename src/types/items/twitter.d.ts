/* eslint no-use-before-define: ["off"] */

export type ReferencedTweetType = 'retweeted' | 'quoted' | 'replied_to';

export interface ReferencedTweet {
  id: number;
  type: ReferencedTweetType;
}

export interface Cashtag {
  start: number;
  end: number;
  tag: string;
}

export interface Hashtag {
  start: number;
  end: number;
  tag: string;
}

export interface Mention {
  start: number;
  end: number;
  username: string;
  user_id: number;
}

export interface URL {
  start: number;
  end: number;
  url: string;
  url_expanded: string;
}

export interface TwitterItem {
  item_id?: string;
  twitter_id?: number;
  twitter_author_id?: number;
  status: string;
  created_at: string; // datetime
  language?: string;
  conversation_id?: number;
  referenced_tweets?: ReferencedTweet[];
  latitude?: number;
  longitude?: number;
  hashtags?: Hashtag[];
  mentions?: Mention[];
  urls?: URL[];
  cashtags?: Cashtag[];
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
}
