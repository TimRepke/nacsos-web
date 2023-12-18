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
  MetaFilter,
  SubQuery,
} from "@/plugins/api/api-core";

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
  | MetaFilter
  | SubQuery;

export function parse(query: string): Array<Filter> {
  const parser = new Parser(compiledGrammar, { keepHistory: true });
  try {
    parser.feed(query);
    return parser.finish();
  } catch (parseError) {
    console.log(parseError);
    // @ts-ignore
    console.log("Error at character " + parseError.offset); // "Error at character 9"
  }
  return [];
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
