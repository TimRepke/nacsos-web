/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationValue } from './AnnotationValue';
import type { Label } from './Label';

export type ItemAnnotation = {
  value_bool?: (boolean | null);
  value_int?: (number | null);
  value_float?: (number | null);
  value_str?: (string | null);
  multi_int?: (Array<number> | null);
  annotation_id?: (string | null);
  time_created?: (string | null);
  time_updated?: (string | null);
  assignment_id: string;
  user_id: string;
  item_id: string;
  annotation_scheme_id: string;
  key: string;
  repeat?: number;
  parent?: (string | null);
  text_offset_start?: (number | null);
  text_offset_stop?: (number | null);
  path: Array<Label>;
  old?: (AnnotationValue | null);
};

