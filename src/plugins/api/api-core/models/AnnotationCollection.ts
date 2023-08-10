/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupedAnnotationsOutput } from './GroupedAnnotationsOutput';
import type { Label } from './Label';
import type { UserModelOutput } from './UserModelOutput';

export type AnnotationCollection = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<GroupedAnnotationsOutput>>;
  annotators: Array<UserModelOutput>;
};

