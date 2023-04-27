/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RankEntry = {
  properties: {
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
      isRequired: true,
    },
    username: {
      type: 'string',
      isRequired: true,
    },
    full_name: {
      type: 'string',
      isRequired: true,
    },
    email: {
      type: 'string',
      isRequired: true,
    },
    affiliation: {
      type: 'string',
      isRequired: true,
    },
    num_labels: {
      type: 'number',
      isRequired: true,
    },
    num_labeled_items: {
      type: 'number',
      isRequired: true,
    },
  },
} as const;
