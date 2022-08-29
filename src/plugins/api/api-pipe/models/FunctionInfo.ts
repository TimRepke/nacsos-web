/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Artefact } from './Artefact';
import type { KWARG } from './KWARG';

export type FunctionInfo = {
  module: string;
  function: string;
  kwargs: Record<string, KWARG>;
  name: string;
  docstring: string;
  artefacts: Record<string, Artefact>;
  filepath: string;
  filepath_rel: string;
  tags?: Array<string>;
  est_cpu_load?: FunctionInfo.est_cpu_load;
  recommended_lifetime?: number;
};

export namespace FunctionInfo {

  export enum est_cpu_load {
    VHIGH = 'VHIGH',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
    MINIMAL = 'MINIMAL',
  }


}

