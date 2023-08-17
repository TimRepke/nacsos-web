/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImportConfigTwitter = {
  func_name: any;
  query: string;
  max_results?: (number | null);
  next_token?: (string | null);
  since_id?: (string | null);
  until_id?: (string | null);
  sort_order?: ImportConfigTwitter.sort_order;
  start_time?: (string | null);
  end_time?: (string | null);
  bearer_token: string;
  results_per_response?: number;
  max_requests?: number;
  max_tweets?: number;
};

export namespace ImportConfigTwitter {

  export enum sort_order {
    RECENCY = 'recency',
    RELEVANCY = 'relevancy',
  }


}

