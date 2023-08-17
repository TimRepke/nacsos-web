/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SerializedArtefact } from './SerializedArtefact';

export type KWARG = {
  dtype: Array<string>;
  optional?: (boolean | null);
  default?: (number | boolean | string | null);
  artefact?: (SerializedArtefact | null);
  params?: (Record<string, KWARG> | null);
  options?: (Array<string> | null);
  generics?: (Array<string> | null);
};

