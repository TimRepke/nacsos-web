/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationMatrix } from './AnnotationMatrix';
import type { BotAnnotationModel } from './BotAnnotationModel';

export type ResolutionProposalResponse = {
  matrix: AnnotationMatrix;
  proposal: Array<BotAnnotationModel>;
};

