/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeInfo } from './AnnotationSchemeInfo';
import type { FlatLabel } from './FlatLabel';
import type { ResolutionCell } from './ResolutionCell';
import type { ResolutionOrdering } from './ResolutionOrdering';
import type { UserModel } from './UserModel';

export type ResolutionProposal = {
  scheme_info: AnnotationSchemeInfo;
  labels: Array<FlatLabel>;
  annotators: Array<UserModel>;
  ordering: Array<ResolutionOrdering>;
  matrix: Record<string, Record<string, ResolutionCell>>;
};

