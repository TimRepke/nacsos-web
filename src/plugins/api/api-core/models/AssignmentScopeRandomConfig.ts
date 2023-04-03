/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AssignmentScopeRandomConfig = {
  config_type?: AssignmentScopeRandomConfig.config_type;
  users?: Array<string>;
  num_items: number;
  min_assignments_per_item: number;
  max_assignments_per_item: number;
  num_multi_coded_items: number;
  random_seed: number;
};

export namespace AssignmentScopeRandomConfig {

  export enum config_type {
    RANDOM = 'random',
    RANDOM_EXCLUSION = 'random_exclusion',
  }


}

