/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeLabelInput } from './AnnotationSchemeLabelInput';

/**
 *
 * Corresponds to db.models.annotations.AnnotationScheme
 *
 * AnnotationScheme defines the annotation scheme for a particular project.
 * Each project may have multiple AnnotationSchemes,
 * but projects cannot share the same scheme. In case they are technically the same,
 * the user would have to create a new copy of that scheme for a different project.
 *
 * The actual annotation scheme is defined as a list of labels (see schemas.annotations.AnnotationSchemeLabel).
 * The other fields pose as meta-data.
 *
 */
export type AnnotationSchemeModelInput = {
  annotation_scheme_id?: (string | null);
  project_id?: (string | null);
  name: string;
  description?: (string | null);
  time_created?: (string | null);
  time_updated?: (string | null);
  labels: Array<AnnotationSchemeLabelInput>;
};

