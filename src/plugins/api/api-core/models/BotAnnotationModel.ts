/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BotAnnotationModel = {
  bot_annotation_id?: (string | null);
  bot_annotation_metadata_id?: (string | null);
  time_created?: (string | null);
  time_updated?: (string | null);
  item_id: string;
  parent?: (string | null);
  key?: (string | null);
  repeat?: number;
  value_bool?: (boolean | null);
  value_int?: (number | null);
  value_float?: (number | null);
  value_str?: (string | null);
  multi_int?: (Array<number> | null);
  confidence?: (number | null);
};

