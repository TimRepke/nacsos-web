/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterInt = {
  filter?: any;
  scopes?: (Array<string> | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterInt.type;
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

