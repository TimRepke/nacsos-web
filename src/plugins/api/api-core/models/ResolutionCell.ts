/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotAnnotationModel } from './BotAnnotationModel';
import type { ResolutionStatus } from './ResolutionStatus';
import type { ResolutionUserEntry } from './ResolutionUserEntry';

export type ResolutionCell = {
  labels: Record<string, Array<ResolutionUserEntry>>;
  resolution?: (BotAnnotationModel | null);
  status?: ResolutionStatus;
};

