/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupedAnnotations } from './GroupedAnnotations';
import type { Label } from './Label';

export type AnnotationCollectionDB = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<GroupedAnnotations>>;
  annotators: Array<string>;
};

