/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AnnotationTrackerModel = {
  description: `
  Tracker for annotation statistics.
  This includes the latest stopping criterion (buscar) metrics and more.

  You may have more than one tracker per project, for example for keeping track of different progresses.
  `,
  properties: {
    annotation_tracking_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }, {
        type: 'null',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'uuid',
      }, {
        type: 'string',
      }],
      isRequired: true,
    },
    inclusion_rule: {
      type: 'string',
      isRequired: true,
    },
    majority: {
      type: 'boolean',
      isRequired: true,
    },
    n_items_total: {
      type: 'number',
      isRequired: true,
    },
    recall_target: {
      type: 'number',
      isRequired: true,
    },
    source_ids: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'string',
          format: 'uuid',
        },
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }, {
        type: 'null',
      }],
    },
    labels: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'array',
          contains: {
            type: 'number',
          },
        },
      }, {
        type: 'null',
      }],
    },
    recall: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'number',
        },
      }, {
        type: 'null',
      }],
    },
    buscar: {
      type: 'any-of',
      contains: [{
        type: 'array',
        contains: {
          type: 'any[]',
          maxItems: 2,
          minItems: 2,
        },
      }, {
        type: 'null',
      }],
    },
    time_created: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
    time_updated: {
      type: 'any-of',
      contains: [{
        type: 'string',
        format: 'date-time',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
