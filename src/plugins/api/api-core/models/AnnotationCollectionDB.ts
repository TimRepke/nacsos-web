/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { items } from './items';
import type { Label } from './Label';

export type AnnotationCollectionDB = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<items>>;
  annotators: Array<string>;
};

