/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AssignmentScopeRandomWithExclusionConfigInput = {
  config_type?: AssignmentScopeRandomWithExclusionConfigInput.config_type;
  users?: (Array<string> | null);
  num_items: number;
  min_assignments_per_item: number;
  max_assignments_per_item: number;
  num_multi_coded_items: number;
  random_seed: number;
  excluded_scopes: Array<string>;
};

export namespace AssignmentScopeRandomWithExclusionConfigInput {

  export enum config_type {
    RANDOM = 'random',
    RANDOM_EXCLUSION = 'random_exclusion',
  }


}

