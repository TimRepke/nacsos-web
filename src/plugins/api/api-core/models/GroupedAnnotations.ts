/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModel } from './AnnotationModel';
import type { Label } from './Label';

export type GroupedAnnotations = {
  path: Array<Label>;
  annotations: Array<AnnotationModel>;
};

