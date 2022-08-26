/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SerializedArtefact } from './SerializedArtefact';

export type KWARG = {
  dtype: Array<string>;
  optional?: boolean;
  default?: (number | boolean | string);
  artefact?: SerializedArtefact;
  params?: Record<string, KWARG>;
  options?: Array<string>;
  generics?: Array<string>;
};

