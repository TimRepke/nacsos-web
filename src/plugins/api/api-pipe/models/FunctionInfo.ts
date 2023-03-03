/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Artefact } from './Artefact';
import type { CPULoadClassification } from './CPULoadClassification';
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
  est_cpu_load?: CPULoadClassification;
  recommended_lifetime?: number;
};

