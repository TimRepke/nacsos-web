/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterBool = {
  filter?: any;
  scopes?: (Array<string> | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterBool.type;
  comp?: any;
  value_bool?: (boolean | null);
};

export namespace LabelFilterBool {

  export enum type {
    USER = 'user',
    BOT = 'bot',
    RESOLVED = 'resolved',
  }


}

