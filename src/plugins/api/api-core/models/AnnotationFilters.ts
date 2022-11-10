/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Filter rules for fetching all annotations that match these conditions
 * It is up to the user of this function to make sure to provide sensible filters!
 * All filters are conjunctive (connected with "AND"); if None, they are not included
 *
 * There are no "exclude" filters by design. If needed, they should be simulated in the interface.
 *
 * :param scheme_id: if not None: annotation has to be part of this annotation scheme
 * :param scope_id: if not None: annotation has to be part of this assignment scope
 * :param user_id: if not None: annotation has to be by this user
 * :param key: if not None: annotation has to be for this AnnotationSchemeLabel.key (or list/tuple of keys)
 * :param repeat: if not None: annotation has to be primary/secondary/...
 */
export type AnnotationFilters = {
  scheme_id: string;
  scope_id?: (string | Array<string>);
  user_id?: (string | Array<string>);
  key?: (string | Array<string>);
  repeat?: (number | Array<number>);
};

