/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';

export type LexisNexisItemModel = {
  item_id?: (string | null);
  project_id?: (string | null);
  type?: ItemType;
  text?: (string | null);
  teaser?: (string | null);
  authors?: (Array<string> | null);
};

