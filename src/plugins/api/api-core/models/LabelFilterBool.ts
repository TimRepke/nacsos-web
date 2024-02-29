/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterBool = {
  scopes?: (Array<string> | null);
  scheme?: (string | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterBool.type;
  filter?: any;
  value_type?: any;
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

