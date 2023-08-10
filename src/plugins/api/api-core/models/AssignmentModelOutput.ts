/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssignmentStatus } from './AssignmentStatus';

/**
 *
 * Corresponds to db.models.annotations.Assignment
 *
 * Assignment is used to request a user/annotator (User) to annotate a particular item (BaseItem) in the database
 * following a pre-defined annotation scheme (AnnotationScheme).
 *
 * Each AnnotationScheme will have several Assignments.
 * Each User will "receive" several Assignments.
 * Each Item may have several Assignments (either in relation to different AnnotationSchemes or double-coding).
 * The Project is implicit by the AnnotationScheme.
 *
 * The most common use-cases are:
 * * Creating assignments in bulk at random (e.g. 3 users should annotate 50 documents each)
 * * Creating assignments one at a time based on a set of rules (e.g. for double-coding, defined order, bias, ...)
 * * Creating assignments in small batches or one-by-one in prioritised annotation settings
 *
 */
export type AssignmentModelOutput = {
  assignment_id: (string | null);
  assignment_scope_id: string;
  user_id: string;
  item_id: string;
  annotation_scheme_id: string;
  status: AssignmentStatus;
  order: (number | null);
};

