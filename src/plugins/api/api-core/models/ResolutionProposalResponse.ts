/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollection } from './AnnotationCollection';
import type { FlattenedAnnotationSchemeLabel } from './FlattenedAnnotationSchemeLabel';
import type { GroupedBotAnnotation } from './GroupedBotAnnotation';

export type ResolutionProposalResponse = {
  collection: AnnotationCollection;
  proposal: Record<string, Array<GroupedBotAnnotation>>;
  scheme_flat: Array<FlattenedAnnotationSchemeLabel>;
};

