/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterInt = {
  scopes?: (Array<string> | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterInt.type;
  filter?: any;
  value_type?: any;
  value_int?: (number | null);
  comp: string;
};

export namespace LabelFilterInt {

  export enum type {
    USER = 'user',
    BOT = 'bot',
    RESOLVED = 'resolved',
  }


}

