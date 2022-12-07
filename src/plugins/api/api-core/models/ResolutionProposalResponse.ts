/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationCollection } from './AnnotationCollection';
import type { FlattenedAnnotationSchemeLabel } from './FlattenedAnnotationSchemeLabel';

export type ResolutionProposalResponse = {
  collection: AnnotationCollection;
  proposal: Record<string, Array<Array<any>>>;
  scheme_flat: Array<FlattenedAnnotationSchemeLabel>;
};

