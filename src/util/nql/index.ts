import { Grammar, Parser } from "nearley";
import grammar from "@/util/nql/grammar";

export const compiledGrammar = Grammar.fromCompiled(grammar);

export function getParser(): Parser {
  return new Parser(compiledGrammar);
}

export default function parse(query: string): Array<object> {
  const parser = new Parser(compiledGrammar);
  parser.feed(query);
  const parsed = parser.finish();
  console.log(parsed);
  return parsed;
}
