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
} from "@/plugins/api/api-core";

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

export function parse(query: string): Array<Filter> {
  try {
    const parser = getParser();
    parser.feed(query);
    return parser.finish();
  } catch (parseError) {
    console.log(parseError);
    // @ts-ignore
    console.log("Error at character " + parseError.offset); // "Error at character 9"
  }
  return [];
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
