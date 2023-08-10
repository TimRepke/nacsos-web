/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImportConfigTwitterOutput = {
  query: string;
  max_results: (number | null);
  next_token: (string | null);
  since_id: (string | null);
  until_id: (string | null);
  sort_order: ImportConfigTwitterOutput.sort_order;
  start_time: (string | null);
  end_time: (string | null);
};

export namespace ImportConfigTwitterOutput {

  export enum sort_order {
    RECENCY = 'recency',
    RELEVANCY = 'relevancy',
  }


}

