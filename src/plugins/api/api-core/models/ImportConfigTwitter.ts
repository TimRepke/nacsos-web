/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImportConfigTwitter = {
  query: string;
  max_results?: number;
  next_token?: string;
  since_id?: string;
  until_id?: string;
  sort_order?: ImportConfigTwitter.sort_order;
  start_time?: string;
  end_time?: string;
};

export namespace ImportConfigTwitter {

  export enum sort_order {
    RECENCY = 'recency',
    RELEVANCY = 'relevancy',
  }


}

