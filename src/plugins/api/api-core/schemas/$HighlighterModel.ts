/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $HighlighterModel = {
  description: `
  A highlighter can be used in a project to highlight tokens in text to make
  it easier for users to annotate documents when certain keywords are highlighted.

  It is assumed, that a highlighter roughly corresponds to query terms.
  Furthermore, keywords in a highlighter will typically be joined into
  a regular expression group (e.g. "(keyword1|double keyword|wildcar.*)").

  Each matching group will be wrapped in a highlight span in the frontend.
  `,
  properties: {
    highlighter_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    keywords: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
    style: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'null',
      }],
    },
  },
} as const;
