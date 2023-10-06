/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';

/**
 * Corresponds to db.models.items.generic.GenericItem
 */
export type GenericItemModel = {
  item_id?: (string | null);
  project_id?: (string | null);
  type?: ItemType;
  text?: (string | null);
  meta: any;
};

