import type { HighlighterModel } from "@/plugins/api/spec";

export const PROJECT_ID = "52a2d8c1-a650-448f-9d11-94f7df1197e2";

export const RESTRICTING_ID = "734fe753-dfa9-4805-a4d6-634bc9108b62";
export const STUDY_ID = "37987a2c-36f2-4965-8a10-942c2a7fe8e7";
export const ADDITIONAL_ID = "38b16995-2633-440f-b648-c438e87aa437";
export const QUERY_ID = "f9790cd2-8348-4011-b161-c0f481b78cd4";

/**
 * Real-world project highlighters (as returned by the API).
 *
 * Keywords are used as raw regular expressions (joined with `|`, flags `gi`) —
 * unescaped, so metacharacters act as regex syntax. As a result the `X*`
 * patterns in these fixtures are quantifiers ("increa" + optional "s"), not
 * wildcards, and match almost nothing; see the `it.fails` cases in the spec.
 */
export const projectHighlighters: HighlighterModel[] = [
  {
    highlighter_id: RESTRICTING_ID,
    project_id: PROJECT_ID,
    name: "Restricting query terms",
    keywords: [
      "\\bmitigat*\\b",
      "\\bsequest*\\b",
      "\\burban\\b",
      "\\bagrofor*\\b",
      "\\bagroforestry\\b",
      "agri*\\b",
      "management\\b",
      "gully\\b",
    ],
    style: "background-color: #ff9aa2;",
  },
  {
    highlighter_id: STUDY_ID,
    project_id: PROJECT_ID,
    name: "Study terms",
    keywords: [
      "\\bthis study\\b",
      "\\bhere, we\\b",
      "\\bobjective\\b",
      "\\bthe study\\b",
      "\\bstudy\\b",
      "\\breview\\b",
      "\\bChina\\b",
      "\\bsurvey*\\b",
      "surveys\\b",
      "satellite\\b",
      "model*\\b",
      "simulat*\\b",
    ],
    style: "background-color: #fec601;",
  },
  {
    highlighter_id: ADDITIONAL_ID,
    project_id: PROJECT_ID,
    name: "Additional terms",
    keywords: [
      "\\bagroforestry\\b",
      "\\bdensity\\b",
      "\\bmitigat*\\b",
      "\\bnegative\\b",
      "\\bremoval\\b",
      "\\bsink\\b",
      "\\bsequest*\\b",
      "\\burban\\b",
      "\\bagrofor*\\b",
      "\\bmodel\\b",
      "simulation*\\b",
      "mangroves\\b",
      "\\bshrub*\\b",
      "\\bcost\\b",
      "\\bmeta\\b",
      "\\bmodel*\\b",
      "\\bsimulat*\\b",
      "\\bempirical*\\b",
      "\\bmeasure*\\b",
      "\\bsensing\\b",
    ],
    style: "background-color: #0d6efd; color: #fff; padding: 2px 4px;",
  },
  {
    highlighter_id: QUERY_ID,
    project_id: PROJECT_ID,
    name: "Query terms",
    keywords: [
      "\\bafforestation\\b",
      "\\breforestation\\b",
      "\\btree\\b",
      "\\bforest\\b",
      "\\brestor*\\b",
      "\\bplant\\b",
      "\\bplanted\\b",
      "\\bplanting\\b",
      "\\bregenerat*\\b",
      "\\bregrow*\\b",
      "\\barea\\b",
      "\\bcover\\b",
      "\\bincreas*\\b",
      "restoration\\b",
    ],
    style: "background-color: #0cf27b;",
  },
];

/**
 * Same highlighters as `projectHighlighters` but with the `\b`/`*` glob
 * decorations stripped from the keywords, so they match as plain prefixes
 * (e.g. `\bmitigat*\b` -> `mitigat`, matching the bare prefix "mitigat").
 */
export function toMatchable(highlighters: HighlighterModel[]): HighlighterModel[] {
  return highlighters.map((h) => ({
    ...h,
    keywords: h.keywords.map((k) => k.replace(/\\b/g, "").replace(/\*/g, "").trim()),
  }));
}

export const matchableHighlighters: HighlighterModel[] = toMatchable(projectHighlighters);

/** Highlighters with invalid/broken entries mixed in. */
export const highlightersWithInvalid: HighlighterModel[] = [
  // keywords is null -> must be skipped with a warning, must not break the others
  {
    highlighter_id: RESTRICTING_ID,
    project_id: PROJECT_ID,
    name: "Broken (null keywords)",
    keywords: null as unknown as string[],
    style: "background-color: #ff9aa2;",
  },
  // no keywords at all -> must be skipped silently
  {
    highlighter_id: STUDY_ID,
    project_id: PROJECT_ID,
    name: "Empty keywords",
    keywords: [],
    style: "background-color: #fec601;",
  },
  // a valid highlighter after the broken ones -> must still be applied
  ...projectHighlighters.filter((h) => h.highlighter_id === QUERY_ID),
];

/** Highlighter whose style tries to break out of the span via HTML injection. */
export const highlightersWithMaliciousStyle: HighlighterModel[] = [
  {
    highlighter_id: QUERY_ID,
    project_id: PROJECT_ID,
    name: "XSS style",
    keywords: ["forest"],
    style: 'background: red; "</span><img src=x onerror=alert(1)>',
  },
];

/** All highlighter ids of `projectHighlighters`. */
export const allHighlighterIds: string[] = projectHighlighters.map((h) => h.highlighter_id);
