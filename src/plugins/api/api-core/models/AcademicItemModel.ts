/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';

/**
 * Corresponds to db.schema.items.academic.AcademicItem
 */
export type AcademicItemModel = {
  item_id?: string;
  project_id?: string;
  type?: ItemType;
  text: string;
};

