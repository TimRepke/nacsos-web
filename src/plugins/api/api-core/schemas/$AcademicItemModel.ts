/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AcademicItemModel = {
  description: `Corresponds to db.schema.items.academic.AcademicItem`,
  properties: {
    item_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    type: {
      type: 'ItemType',
    },
    text: {
      type: 'string',
    },
    doi: {
      type: 'string',
    },
    wos_id: {
      type: 'string',
    },
    scopus_id: {
      type: 'string',
    },
    openalex_id: {
      type: 'string',
    },
    s2_id: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    title_slug: {
      type: 'string',
    },
    publication_year: {
      type: 'number',
    },
    source: {
      type: 'string',
    },
    keywords: {
      type: 'array',
      contains: {
        type: 'string',
      },
    },
    authors: {
      type: 'array',
      contains: {
        type: 'AcademicAuthorModel',
      },
    },
  },
} as const;
