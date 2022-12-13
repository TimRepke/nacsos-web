/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';

/**
 * Corresponds to db.models.items.generic.GenericItem
 */
export type GenericItemModel = {
  item_id?: string;
  project_id?: string;
  type?: ItemType;
  text?: string;
  meta: any;
};

