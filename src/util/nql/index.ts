import { Grammar, Parser } from "nearley";
import grammar from "@/util/nql/grammar";

export const compiledGrammar = Grammar.fromCompiled(grammar);

export function getParser(): Parser {
  return new Parser(compiledGrammar);
}

export default function parse(query: string): Array<object> {
  const parser = new Parser(compiledGrammar,
    { keepHistory: true });
  try {
    parser.feed(query);
    const parsed = parser.finish();
    console.log(query);
    console.log(parsed);
    console.log(parser.table);
    return parsed;
  } catch (parseError) {
    console.log(parseError)
    console.log("Error at character " + parseError.offset); // "Error at character 9"
  }
}
