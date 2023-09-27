/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 *
 * Tracker for annotation statistics.
 * This includes the latest stopping criterion (buscar) metrics and more.
 *
 * You may have more than one tracker per project, for example for keeping track of different progresses.
 *
 */
export type AnnotationTrackerModel = {
  annotation_tracking_id?: (string | null);
  name: string;
  project_id: string;
  inclusion_rule: string;
  majority: boolean;
  n_items_total: number;
  recall_target: number;
  source_ids?: (Array<string> | null);
  labels?: (Array<Array<number>> | null);
  recall?: (Array<number> | null);
  buscar?: (Array<any[]> | null);
  time_created?: (string | null);
  time_updated?: (string | null);
};

