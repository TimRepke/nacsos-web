/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Label } from './Label';
import type { UserModel } from './UserModel';

export type AnnotationCollection = {
  scheme_id: string;
  labels: Array<Array<Label>>;
  annotations: Record<string, Array<Array<any>>>;
  annotators: Array<UserModel>;
};

