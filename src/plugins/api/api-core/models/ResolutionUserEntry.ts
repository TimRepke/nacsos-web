/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DehydratedAssignment } from './DehydratedAssignment';
import type { ItemAnnotation } from './ItemAnnotation';
import type { ResolutionStatus } from './ResolutionStatus';

export type ResolutionUserEntry = {
  assignment?: (DehydratedAssignment | null);
  annotation?: (ItemAnnotation | null);
  status?: ResolutionStatus;
};

