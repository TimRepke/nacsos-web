/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlattenedAnnotationSchemeLabel } from './FlattenedAnnotationSchemeLabel';

/**
 * Same as AnnotationSchemeModel but with flattened structure.
 */
export type AnnotationSchemeModelFlat = {
  annotation_scheme_id?: (string | null);
  project_id?: (string | null);
  name: string;
  description?: (string | null);
  time_created?: (string | null);
  time_updated?: (string | null);
  labels: Array<FlattenedAnnotationSchemeLabel>;
};

