/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ItemType } from './ItemType';
import type { UserBaseModel } from './UserBaseModel';

export type ProjectInfo = {
  project_id?: (string | null);
  name: string;
  description?: (string | null);
  time_created?: (string | null);
  type: ('generic' | 'twitter' | 'academic' | 'patents' | ItemType);
  setting_motivational_quotes?: boolean;
  owners: Array<UserBaseModel>;
};

