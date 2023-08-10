/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupedAnnotationsInput } from './GroupedAnnotationsInput';
import type { Label } from './Label';

export type AnnotationCollectionDBInput = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<GroupedAnnotationsInput>>;
  annotators: Array<string>;
};

