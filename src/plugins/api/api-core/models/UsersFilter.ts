/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UsersFilter = {
  user_ids: Array<string>;
  mode: UsersFilter.mode;
};

export namespace UsersFilter {

  export enum mode {
    ALL = 'ALL',
    ANY = 'ANY',
  }


}

