/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AssignmentScopeRandomWithExclusionConfigOutput = {
  config_type: AssignmentScopeRandomWithExclusionConfigOutput.config_type;
  users: (Array<string> | null);
  num_items: number;
  min_assignments_per_item: number;
  max_assignments_per_item: number;
  num_multi_coded_items: number;
  random_seed: number;
  excluded_scopes: Array<string>;
};

export namespace AssignmentScopeRandomWithExclusionConfigOutput {

  export enum config_type {
    RANDOM = 'random',
    RANDOM_EXCLUSION = 'random_exclusion',
  }


}

