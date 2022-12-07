/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Corresponds to db.models.annotations.Annotation
 *
 * Annotation holds the judgement of a User for a specific Item in the context of an AnnotationScheme
 * as a response to an Assignment.
 * Once an Annotation exists, the Assignment should be considered (partially) resolved.
 *
 * Note, that AnnotationScheme, User, and Item would be implicit by the Assignment.
 * However, for ease of use and in favour of fewer joins, this information is replicated here.
 *
 * The Annotation refers to an AnnotationSchemeLabel defined in an AnnotationScheme, which is referred to by its `key`.
 * If the scheme allows the user to make repeated annotations for the same Label (`key`),
 * an offset is defined in `repeat` (e.g. for primary technology is "natural tech", secondary is "forests").
 *
 * Furthermore, in-text annotations refer to a substring in the Item text, for which the optional fields
 * `text_offset_start` and `text_offset_end` can be used.
 *
 * Note, that there is no database constraints on the completeness of an Assignment/AnnotationScheme.
 * The interface/backend code should be used to make sure, to either not allow partial fulfillment of an
 * AnnotationScheme or not display an Assignment as complete.
 */
export type AnnotationModel = {
  annotation_id?: string;
  time_created?: string;
  time_updated?: string;
  assignment_id: string;
  user_id: string;
  item_id: string;
  annotation_scheme_id: string;
  key: string;
  repeat?: number;
  parent?: string;
  value_bool?: boolean;
  value_int?: number;
  value_float?: number;
  value_str?: string;
  multi_int?: Array<number>;
  text_offset_start?: number;
  text_offset_stop?: number;
};

