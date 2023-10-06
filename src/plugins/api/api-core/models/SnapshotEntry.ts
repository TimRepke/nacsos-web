/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SnapshotEntry = {
  value_bool?: (boolean | null);
  value_int?: (number | null);
  value_float?: (number | null);
  value_str?: (string | null);
  multi_int?: (Array<number> | null);
  order_key: string;
  path_key: string;
  item_id: string;
  anno_id: string;
  user_id: string;
};

