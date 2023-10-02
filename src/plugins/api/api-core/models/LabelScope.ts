/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LabelScope = {
  scope_id: string;
  name: string;
  scope_type: LabelScope.scope_type;
};

export namespace LabelScope {

  export enum scope_type {
    H = 'H',
    R = 'R',
  }


}

