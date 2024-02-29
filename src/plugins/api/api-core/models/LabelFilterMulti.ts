/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterMulti = {
  scopes?: (Array<string> | null);
  scheme?: (string | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterMulti.type;
  filter?: any;
  value_type?: any;
  multi_int?: (Array<number> | null);
  comp: string;
};

export namespace LabelFilterMulti {

  export enum type {
    USER = 'user',
    BOT = 'bot',
    RESOLVED = 'resolved',
  }


}

