import { Grammar, Parser } from "nearley";
import grammar from "@/util/nql/grammar";
import type {
  AnnotationFilter,
  AssignmentFilter,
  FieldFilter,
  FieldFilters,
  ImportFilter,
  LabelFilterBool,
  LabelFilterInt,
  LabelFilterMulti,
  MetaFilterBool,
  MetaFilterInt,
  MetaFilterStr,
  SubQuery,
} from "@/plugins/api/types";

export interface Column {
  grammar: Grammar;
  index: number;
  states: Array<any>;
  wants: Record<string, any>;
  scannable: Array<any>;
  completed: Record<string, any>;
  process: (nextColumn: Column) => void;
  predict: (exp: any) => void;
  complete: (left: any, right: any) => void;
}

//
// class Parser extends Psr {
//   table: Array<Column> = [];
// }

// export interface Parser   Psr & {
//   table: Array<Column>;
// }

export const compiledGrammar = Grammar.fromCompiled(grammar);

export function getParser(): Parser {
  return new Parser(compiledGrammar);
}

export type Filter =
  | AnnotationFilter
  | AssignmentFilter
  | FieldFilter
  | FieldFilters
  | ImportFilter
  | LabelFilterBool
  | LabelFilterInt
  | LabelFilterMulti
  | MetaFilterBool
  | MetaFilterInt
  | MetaFilterStr
  | SubQuery;

export interface ParseOutcome {
  /** True only if the query parsed successfully to at least one filter. */
  valid: boolean;
  /** The parsed filters; empty when `valid` is false. */
  results: Array<Filter>;
  /** Human-readable error description; set when `valid` is false. */
  error?: string;
}

/**
 * Parse a query and report whether it is a valid NQL query.
 * Distinguishes "failed to parse" from "no filters" — consumers must not treat
 * an invalid query as an unfiltered match-all query.
 */
export function tryParse(query: string): ParseOutcome {
  try {
    const parser = getParser();
    parser.feed(query);
    const results = parser.finish();
    if (results.length === 0) {
      return { valid: false, results: [], error: "Query did not match any NQL rule." };
    }
    return { valid: true, results };
  } catch (parseError) {
    // @ts-ignore
    const offset = parseError?.offset;
    return {
      valid: false,
      results: [],
      error: offset !== undefined ? "Error at character " + offset : "Invalid NQL query.",
    };
  }
}

export function parse(query: string): Array<Filter> {
  return tryParse(query).results;
}

export function parseHist(query: string): (Parser & { table: Array<Column> }) | undefined {
  try {
    const parser = new Parser(compiledGrammar, { keepHistory: true });
    parser.feed(query);
    parser.finish();
    // @ts-ignore
    return parser;
  } catch (parseError) {
    console.error(parseError);
    // @ts-ignore
    console.log("Error at character " + parseError.offset); // "Error at character 9"
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hint helpers for the visual query mode.
//
// These use the live Earley parser state to answer three questions about the
// text the user has typed so far:
//   1. where is the syntax error (if any),
//   2. what tokens/keywords could legally come next,
//   3. whether the caret sits inside an ID-value context (e.g. after "import:")
//      so the UI can offer concrete IDs to pick from.
// ─────────────────────────────────────────────────────────────────────────────

interface CompiledRule {
  name: string;
  symbols: Array<string | RegExp | { literal?: string }>;
}

const compiledRulesByName: Map<string, CompiledRule[]> = (() => {
  const map = new Map<string, CompiledRule[]>();
  for (const rule of compiledGrammar.rules as unknown as CompiledRule[]) {
    const list = map.get(rule.name);
    if (list) list.push(rule);
    else map.set(rule.name, [rule]);
  }
  return map;
})();

/**
 * Recompose the literal text of a compiled case-insensitive keyword rule.
 * nearley compiles e.g. `"IS ASSIGNED WITH"i` into a $subexpression$ rule of
 * single-character regex/literal symbols; if all symbols are single characters
 * we can join them back into readable text. Returns null for rules that are
 * not purely literal text (e.g. `[A-Za-z0-9_./:-]:+`).
 */
function keywordText(name: string): string | null {
  for (const rule of compiledRulesByName.get(name) ?? []) {
    let text = "";
    let isKeyword = rule.symbols.length > 0;
    for (const symbol of rule.symbols) {
      let ch: string | null = null;
      if (typeof symbol === "string") {
        ch = symbol.length === 1 ? symbol : null;
      } else if (symbol instanceof RegExp) {
        if (symbol.source.length === 1) ch = symbol.source;
        else {
          const cls = /^\[(.+)\]$/.exec(symbol.source);
          if (cls && cls[1].length <= 2 && !cls[1].startsWith("\\") && !cls[1].startsWith("^")) ch = cls[1][0];
        }
      } else if (typeof symbol?.literal === "string" && symbol.literal.length === 1) {
        ch = symbol.literal;
      }
      if (ch === null) {
        isKeyword = false;
        break;
      }
      text += ch;
    }
    if (isKeyword && /^[A-Za-z][A-Za-z ]*$/.test(text)) return text;
  }
  return null;
}

export interface HintChip {
  /** Text shown on the chip. */
  label: string;
  /** Text inserted into the query when the chip is clicked. */
  insert: string;
}

export interface HintState {
  /** False when the parser could not consume all text before the caret. */
  ok: boolean;
  /** 0-based character offset of the offending character (only when !ok). */
  errorOffset?: number;
  /** Clickable suggestions for what could legally come next. */
  chips: HintChip[];
  /** Human-readable description of values the parser still expects. */
  expected: string[];
  /** Raw non-terminal names the parser still wants at this position. */
  wants: string[];
  /** True when the text before the caret parses as a complete query. */
  complete: boolean;
}

const PUNCT_CHIPS = new Set(["(", ")", ",", "&", "|", ":"]);
/** Short aliases are hidden from the chips; the long form is offered instead. */
const ALIAS_DROP = new Set(["ti", "abs", "py", "yr", "pd", "src"]);
const FIELD_TEXTS = new Set([
  "title",
  "abstract",
  "text",
  "year",
  "date",
  "doi",
  "oa",
  "id",
  "source",
  "meta",
  "label",
  "import",
]);
/** Internal/structural rule names that would only add noise to the hints. */
const HIDDEN_WANTS = new Set([
  "main",
  "query",
  "or_expr",
  "and_expr",
  "not_expr",
  "primary",
  "_",
  "__",
  "H",
  "assigned_clause",
  "annotation_clause",
  "abstract_clause",
  "label_clause_users",
]);
/** Rule names already represented by chips generated from their subexpressions. */
const CHIP_RULE_LABELS: Record<string, HintChip[]> = {
  TITLE: [{ label: "title", insert: "title: " }],
  ABSTRACT: [{ label: "abstract", insert: "abstract: " }],
  PYEAR: [{ label: "year", insert: "year: " }],
  PDATE: [{ label: "date", insert: "date: " }],
  SRC: [{ label: "source", insert: "source: " }],
  META: [{ label: "meta", insert: "meta: " }],
  LABEL: [{ label: "label", insert: "label: " }],
  IMPORT: [{ label: "import", insert: "import: " }],
  AND: [{ label: "and", insert: "and " }],
  OR: [{ label: "or", insert: "or " }],
  NEGATE: [{ label: "not", insert: "not " }],
};
const SYMBOL_LABELS: Record<string, string> = {
  dqstring: '"text"',
  uuids: "UUID(s)",
  ie_uuids: "import UUID(s), prefix with - to exclude",
  dois: "DOI(s)",
  oa_ids: "OpenAlex ID (W…)",
  UUID: "UUID",
  KEY: "key",
  year: "YYYY",
  date: "YYYY-MM-DD",
  uint: "number",
  uints: "numbers",
  float: "number",
  bool: "true / false",
  COMP: "= < <= > >= !=",
  COMP_EXT: "LIKE / SIMILAR / =",
  COMP_SET: "== @> !> &&",
  NEGATE: "not / ~ / -",
  label_type: "user / bot / res",
  meta_clause: "key = value",
  label_clause: "key + comparison",
  label_clause_val: "key + comparison",
};

/**
 * Analyze the query text up to the caret and report the syntax-error position
 * (if any), the tokens that could come next, and whether the prefix is a
 * complete valid query.
 */
export function hintState(query: string, caret = query.length): HintState {
  const text = query.slice(0, Math.max(0, Math.min(caret, query.length)));
  const parser = new Parser(compiledGrammar);
  let ok = true;
  let errorOffset: number | undefined;
  try {
    parser.feed(text);
  } catch (err) {
    ok = false;
    const off = (err as { offset?: unknown }).offset;
    errorOffset = typeof off === "number" ? off : text.length;
  }

  // On error the last column is empty (the offending token produced no states),
  // so walk back to the last column with states: it describes what was legal
  // right before the error.
  const table = (parser as unknown as { table: Column[] }).table;
  let col: Column | undefined;
  for (let i = table.length - 1; i >= 0; i--) {
    if (table[i].states.length > 0) {
      col = table[i];
      break;
    }
  }

  const chips: HintChip[] = [];
  const expected: string[] = [];
  const seen = new Set<string>();
  if (col) {
    for (const state of col.scannable as Array<any>) {
      const symbol = state.rule.symbols[state.dot];
      if (symbol && typeof symbol === "object" && !(symbol instanceof RegExp)) {
        const literal = symbol.literal;
        if (typeof literal === "string" && PUNCT_CHIPS.has(literal) && !seen.has(literal)) {
          seen.add(literal);
          chips.push({ label: literal, insert: literal === "," ? ", " : literal });
        }
      }
    }
    for (const name of Object.keys(col.wants)) {
      if (name.startsWith("_") || HIDDEN_WANTS.has(name)) continue;
      // Intermediate compiler rules ($string$, $subexpression$, $ebnf$, …):
      // surface them only when they spell out a readable keyword.
      if (name.includes("$")) {
        const keyword = keywordText(name);
        if (keyword) {
          const lower = keyword.toLowerCase();
          if (!ALIAS_DROP.has(lower) && !seen.has(lower)) {
            seen.add(lower);
            chips.push({ label: keyword, insert: FIELD_TEXTS.has(lower) ? keyword + ": " : keyword + " " });
          }
        }
        continue;
      }
      const curated = CHIP_RULE_LABELS[name];
      if (curated) {
        for (const chip of curated) {
          if (!seen.has(chip.label.toLowerCase())) {
            seen.add(chip.label.toLowerCase());
            chips.push(chip);
          }
        }
        continue;
      }
      const label = SYMBOL_LABELS[name];
      const shown = label ?? name;
      if (!expected.includes(shown)) expected.push(shown);
    }
  }

  const results = ok ? ((parser as unknown as { results?: unknown[] }).results ?? []) : [];
  return { ok, errorOffset, chips, expected, wants: col ? Object.keys(col.wants) : [], complete: results.length > 0 };
}

export type IdContextKind = "import" | "item" | "openalex" | "doi" | "scope" | "scheme" | "user";

export interface IdContext {
  kind: IdContextKind;
  /** The partial ID the user has typed after the context keyword (may be ""). */
  partial: string;
}

/**
 * Trailing-keyword patterns. Each matches the text that precedes a value the
 * user is currently typing (after stripping the partial token itself). The
 * `(?:[^}\]]*,\s*)?` tails allow values inside an already-started list.
 */
const ID_CONTEXT_PATTERNS: Array<{ kind: IdContextKind; re: RegExp }> = [
  { kind: "import", re: /(?:^|[\s(|&])import\s*:\s*(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "item", re: /(?:^|[\s(|&])id\s*:\s*(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "openalex", re: /(?:^|[\s(|&])oa\s*:\s*(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "doi", re: /(?:^|[\s(|&])doi\s*:\s*(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "scope", re: /(?:assigned in|but not in|assigned ignoring|annotation in|\bfrom)\s+(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "scheme", re: /\bwith\s+(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
  { kind: "user", re: /\b(?:by|by any|by all)\s+(?:[[{]\s*)?(?:[^}\]]*,\s*)?$/i },
];

/** Same keywords, for the case where the trailing space is not typed yet. */
const ID_CONTEXT_KEYWORD_END: Array<{ kind: IdContextKind; re: RegExp }> = [
  { kind: "scope", re: /(?:assigned in|but not in|assigned ignoring|annotation in|\bfrom)$/i },
  { kind: "scheme", re: /\bwith$/i },
  { kind: "user", re: /\b(?:by|by any|by all)$/i },
];

/**
 * Parser state sanity check: the keyword heuristic is only trusted when the
 * Earley parser is actually positioned inside a value of that kind (e.g.
 * "meta:with " ends in "with" but expects a comparison, not a UUID).
 */
const ID_CONTEXT_PARSER_GATE: Record<IdContextKind, Set<string>> = {
  import: new Set(["ie_uuid", "_ie_uuids", "ie_uuids", "UUID", "H", "_", "__"]),
  item: new Set(["uuids", "_uuids", "UUID", "H", "_", "__"]),
  scope: new Set(["uuids", "_uuids", "UUID", "H", "_", "__"]),
  user: new Set(["uuids", "_uuids", "UUID", "H", "_", "__"]),
  scheme: new Set(["UUID", "H", "_", "__"]),
  doi: new Set(["DOI", "_dois", "dois", "_", "__"]),
  openalex: new Set(["OA_ID", "_oa_ids", "oa_ids", "_", "__"]),
};

/**
 * Detect whether the caret sits in a context where concrete IDs can be
 * suggested (e.g. right after "import:" or "IS ASSIGNED IN"). `wants` should
 * be HintState.wants for the same caret position; the suggestion is dropped
 * when the parser does not actually expect a value of that kind.
 */
export function detectIdContext(text: string, wants: string[] = []): IdContext | null {
  // Inside a quoted value the keyword characters carry no grammar meaning.
  if ((text.match(/"/g) ?? []).length % 2 === 1) return null;
  const bases = new Set(wants.map((name) => name.split("$")[0]));
  const allowed = (kind: IdContextKind) => {
    if (wants.length === 0) return true; // no parser state available: trust the keyword
    const gate = ID_CONTEXT_PARSER_GATE[kind];
    for (const base of bases) if (gate.has(base)) return true;
    return false;
  };
  const match = /([^\s,:}\]]*)$/.exec(text);
  const partial = match ? match[1] : "";
  const before = text.slice(0, text.length - partial.length);
  for (const { kind, re } of ID_CONTEXT_PATTERNS) {
    if (re.test(before) && allowed(kind)) return { kind, partial };
  }
  for (const { kind, re } of ID_CONTEXT_KEYWORD_END) {
    if (re.test(text) && allowed(kind)) return { kind, partial: "" };
  }
  return null;
}

export function debug(query: string): Array<Filter> {
  const parser = new Parser(compiledGrammar, { keepHistory: true });
  try {
    parser.feed(query);
    const parsed = parser.finish();
    console.log(query);
    console.log(parsed);
    console.log(parser.results);
    console.log(parser);
    return parsed;
  } catch (parseError) {
    console.log(parseError);
    // @ts-ignore
    console.log("Error at character " + parseError.offset); // TS18046
  }
  return [];
}
