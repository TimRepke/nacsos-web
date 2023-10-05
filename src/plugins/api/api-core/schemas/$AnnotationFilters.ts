/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationFilters = {
  description: `Filter rules for fetching all annotations that match these conditions
  It is up to the user of this function to make sure to provide sensible filters!
  All filters are conjunctive (connected with "AND"); if None, they are not included

  There are no "exclude" filters by design. If needed, they should be simulated in the interface.

  :param scheme_id: if not None: annotation has to be part of this annotation scheme
  :param scope_id: if not None: annotation has to be part of this assignment scope
  :param user_id: if not None: annotation has to be by this user
  :param key: if not None: annotation has to be for this AnnotationSchemeLabel.key (or list/tuple of keys)
  :param repeat: if not None: annotation has to be primary/secondary/...`,
  properties: {
    scheme_id: {
      type: 'string',
      isRequired: true,
    },
    scope_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    key: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    repeat: {
      type: 'any-of',
      contains: [{
        type: 'number',
      }, {
        type: 'array',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
    },
  },
} as const;
