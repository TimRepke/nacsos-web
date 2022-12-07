/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlattenedAnnotationSchemeLabel } from './FlattenedAnnotationSchemeLabel';

/**
 * Same as AnnotationSchemeModel but with flattened structure.
 */
export type AnnotationSchemeModelFlat = {
  annotation_scheme_id?: string;
  project_id?: string;
  name: string;
  description?: string;
  labels: Array<FlattenedAnnotationSchemeLabel>;
};

