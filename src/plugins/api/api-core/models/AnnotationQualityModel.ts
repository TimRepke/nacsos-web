/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Annotation Quality Trackers
 * Computing annotator agreements is a little too expensive to do on the fly. Hence, we capture different
 * quality metrics in this table; one row per assignment scope and label.
 */
export type AnnotationQualityModel = {
  annotation_quality_id?: (string | null);
  project_id?: (string | null);
  assignment_scope_id?: (string | null);
  bot_annotation_metadata_id?: (string | null);
  user_base?: (string | null);
  annotations_base?: null;
  user_target?: (string | null);
  annotations_target?: null;
  label_key?: (string | null);
  label_value?: (number | null);
  cohen?: (number | null);
  fleiss?: (number | null);
  randolph?: (number | null);
  krippendorff?: (number | null);
  pearson?: (number | null);
  pearson_p?: (number | null);
  kendall?: (number | null);
  kendall_p?: (number | null);
  spearman?: (number | null);
  spearman_p?: (number | null);
  precision?: (number | null);
  recall?: (number | null);
  f1?: (number | null);
  multi_overlap_mean?: (number | null);
  multi_overlap_median?: (number | null);
  multi_overlap_std?: (number | null);
  num_items?: (number | null);
  num_overlap?: (number | null);
  num_agree?: (number | null);
  num_disagree?: (number | null);
  perc_agree?: (number | null);
  time_created?: (string | null);
  time_updated?: (string | null);
};

