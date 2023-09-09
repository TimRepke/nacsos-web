/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModel } from './AnnotationModel';
import type { DehydratedAssignment } from './DehydratedAssignment';
import type { ResolutionStatus } from './ResolutionStatus';

export type ResolutionUserEntry = {
  assignment?: (DehydratedAssignment | null);
  annotation?: (AnnotationModel | null);
  status?: ResolutionStatus;
};

