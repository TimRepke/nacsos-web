/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImportConfigTwitterInput = {
  query: string;
  max_results?: (number | null);
  next_token?: (string | null);
  since_id?: (string | null);
  until_id?: (string | null);
  sort_order?: ImportConfigTwitterInput.sort_order;
  start_time?: (string | null);
  end_time?: (string | null);
};

export namespace ImportConfigTwitterInput {

  export enum sort_order {
    RECENCY = 'recency',
    RELEVANCY = 'relevancy',
  }


}

