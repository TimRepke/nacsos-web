/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Flattened and reduced version of the context_annotation object
 * https://developer.twitter.com/en/docs/twitter-api/annotations/overview
 *
 * NOTE: Under the assumption that we could always recover the `description`
 * of the domain and entity, this information is not stored to save space.
 */
export type ContextAnnotation = {
  domain_id: string;
  domain_name: string;
  entity_id: string;
  entity_name: string;
};

