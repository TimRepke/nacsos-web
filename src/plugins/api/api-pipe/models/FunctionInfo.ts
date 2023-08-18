/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Artefact_Any_ } from './Artefact_Any_';
import type { CPULoadClassification } from './CPULoadClassification';
import type { KWARG } from './KWARG';

export type FunctionInfo = {
  module: string;
  function: string;
  kwargs: Record<string, KWARG>;
  name: string;
  docstring: string;
  artefacts: Record<string, Artefact_Any_>;
  filepath: string;
  filepath_rel: string;
  tags?: (Array<string> | null);
  est_cpu_load?: CPULoadClassification;
  recommended_lifetime?: (number | null);
};

