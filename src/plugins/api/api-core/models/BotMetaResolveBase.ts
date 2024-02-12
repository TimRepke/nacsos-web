/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BotMetaResolveBase = {
  algorithm: BotMetaResolveBase.algorithm;
  ignore_hierarchy: boolean;
  ignore_repeat: boolean;
};

export namespace BotMetaResolveBase {

  export enum algorithm {
    MAJORITY = 'majority',
    FIRST = 'first',
    LAST = 'last',
    TRUST = 'trust',
  }


}

