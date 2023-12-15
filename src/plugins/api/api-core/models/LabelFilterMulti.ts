/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UsersFilter } from './UsersFilter';

export type LabelFilterMulti = {
  filter?: any;
  scopes?: (Array<string> | null);
  users?: (UsersFilter | null);
  repeats?: (Array<number> | null);
  key: string;
  type: LabelFilterMulti.type;
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

