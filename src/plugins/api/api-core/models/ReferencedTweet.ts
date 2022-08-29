/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ReferencedTweet = {
  id: string;
  type: ReferencedTweet.type;
};

export namespace ReferencedTweet {

  export enum type {
    RETWEETED = 'retweeted',
    QUOTED = 'quoted',
    REPLIED_TO = 'replied_to',
  }


}

