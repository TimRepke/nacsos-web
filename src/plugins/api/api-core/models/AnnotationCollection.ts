/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupedAnnotations } from './GroupedAnnotations';
import type { Label } from './Label';
import type { UserModel } from './UserModel';

export type AnnotationCollection = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<GroupedAnnotations>>;
  annotators: Array<UserModel>;
};

