/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 *
 * A highlighter can be used in a project to highlight tokens in text to make
 * it easier for users to annotate documents when certain keywords are highlighted.
 *
 * It is assumed, that a highlighter roughly corresponds to query terms.
 * Furthermore, keywords in a highlighter will typically be joined into
 * a regular expression group (e.g. "(keyword1|double keyword|wildcar.*)").
 *
 * Each matching group will be wrapped in a highlight span in the frontend.
 *
 */
export type HighlighterModelInput = {
  highlighter_id: string;
  project_id: string;
  name: string;
  keywords: Array<string>;
  style?: (string | null);
};

