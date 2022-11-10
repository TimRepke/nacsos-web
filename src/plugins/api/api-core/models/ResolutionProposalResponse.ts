/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollection } from './AnnotationCollection';
import type { BotAnnotationModel } from './BotAnnotationModel';

export type ResolutionProposalResponse = {
  collection: AnnotationCollection;
  proposal: Array<BotAnnotationModel>;
};

