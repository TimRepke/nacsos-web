// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "main", "symbols": ["_", "query", "_"], "postprocess": (d) => d[1]},
    {"name": "query", "symbols": ["title_filter"], "postprocess": (d) => d[0]},
    {"name": "query", "symbols": ["abstract_filter"], "postprocess": (d) => d[0]},
    {"name": "query", "symbols": ["py_filter"], "postprocess": (d) => d[0]},
    {"name": "query", "symbols": ["import_filter"], "postprocess": (d) => d[0]},
    {"name": "query", "symbols": ["label_filter"], "postprocess": (d) => d[0]},
    {"name": "query", "symbols": ["query", "__", "AND", "__", "query"], "postprocess": (d) => ({'and': [d[0], d[4]]})},
    {"name": "query", "symbols": ["query", "__", "OR", "__", "query"], "postprocess": (d) => ({'or':  [d[0], d[4]]})},
    {"name": "query", "symbols": [{"literal":"("}, "_", "query", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "title_filter", "symbols": ["TITLE", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({field: 'title',    value: d[3]})},
    {"name": "abstract_filter", "symbols": ["ABSTRACT", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({field: 'abstract', value: d[3]})},
    {"name": "py_filter", "symbols": ["PYEAR", {"literal":":"}, "_", "COMPARATOR", "_", "uint"], "postprocess": (d) => ({field: 'pub_year', value: d[5], comp: d[3]})},
    {"name": "import_filter", "symbols": ["IMPORT", {"literal":":"}, "_", "uuids"], "postprocess": (d) => ({filter: 'import',  import_ids: d[3]})},
    {"name": "label_filter", "symbols": ["LABEL", {"literal":":"}, "_", "label_clause"], "postprocess": (d) => ({filter: 'label',   clause: d[3]})},
    {"name": "label_clause", "symbols": ["KEY", "_", "COMPARATOR", "_", "uint"]},
    {"name": "KEY$ebnf$1", "symbols": [/[A-Za-z_-]/]},
    {"name": "KEY$ebnf$1", "symbols": ["KEY$ebnf$1", /[A-Za-z_-]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "KEY", "symbols": ["KEY$ebnf$1"], "postprocess": (d) => d.join("")},
    {"name": "TITLE$subexpression$1", "symbols": [/[tT]/, /[iI]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "TITLE", "symbols": ["TITLE$subexpression$1"]},
    {"name": "TITLE$subexpression$2", "symbols": [/[tT]/, /[iI]/, /[tT]/, /[lL]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "TITLE", "symbols": ["TITLE$subexpression$2"]},
    {"name": "ABSTRACT$subexpression$1", "symbols": [/[aA]/, /[bB]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ABSTRACT", "symbols": ["ABSTRACT$subexpression$1"]},
    {"name": "ABSTRACT$subexpression$2", "symbols": [/[aA]/, /[bB]/, /[sS]/, /[tT]/, /[rR]/, /[aA]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ABSTRACT", "symbols": ["ABSTRACT$subexpression$2"]},
    {"name": "PYEAR$subexpression$1", "symbols": [/[pP]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PYEAR", "symbols": ["PYEAR$subexpression$1"]},
    {"name": "PYEAR$subexpression$2", "symbols": [/[yY]/, /[eE]/, /[aA]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PYEAR", "symbols": ["PYEAR$subexpression$2"]},
    {"name": "PYEAR$subexpression$3", "symbols": [/[yY]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PYEAR", "symbols": ["PYEAR$subexpression$3"]},
    {"name": "IMPORT$subexpression$1", "symbols": [/[iI]/, /[mM]/, /[pP]/, /[oO]/, /[rR]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "IMPORT", "symbols": ["IMPORT$subexpression$1"]},
    {"name": "LABEL$subexpression$1", "symbols": [/[lL]/, /[aA]/, /[bB]/, /[eE]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "LABEL", "symbols": ["LABEL$subexpression$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": (d) => null},
    {"name": "uint$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "uint$ebnf$1", "symbols": ["uint$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "uint", "symbols": ["uint$ebnf$1"], "postprocess": (d) => parseInt(d[0].join(""))},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "float$ebnf$1", "symbols": ["float$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "float$ebnf$2", "symbols": []},
    {"name": "float$ebnf$2", "symbols": ["float$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "float", "symbols": ["float$ebnf$1", {"literal":"."}, "float$ebnf$2"], "postprocess": (d) => parseFloat(d[0].join("") + "." + d[2].join(""))},
    {"name": "bool$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "bool", "symbols": ["bool$string$1"], "postprocess": (d) => true},
    {"name": "bool$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "bool", "symbols": ["bool$string$2"], "postprocess": (d) => false},
    {"name": "AND$subexpression$1", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "AND", "symbols": ["AND$subexpression$1"]},
    {"name": "AND", "symbols": [{"literal":"&"}]},
    {"name": "OR$subexpression$1", "symbols": [/[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "OR", "symbols": ["OR$subexpression$1"]},
    {"name": "OR", "symbols": [{"literal":"|"}]},
    {"name": "COMPARATOR", "symbols": [{"literal":"="}], "postprocess": id},
    {"name": "COMPARATOR", "symbols": [{"literal":"<"}], "postprocess": id},
    {"name": "COMPARATOR$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$1"], "postprocess": id},
    {"name": "COMPARATOR", "symbols": [{"literal":">"}], "postprocess": id},
    {"name": "COMPARATOR$string$2", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$2"], "postprocess": id},
    {"name": "COMPARATOR$string$3", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMPARATOR", "symbols": ["COMPARATOR$string$3"], "postprocess": id},
    {"name": "NEGATE$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "NEGATE", "symbols": ["NEGATE$subexpression$1", "__"]},
    {"name": "NEGATE", "symbols": [{"literal":"~"}]},
    {"name": "NEGATE", "symbols": [{"literal":"-"}]},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": (d) => d[1].join("")},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": (d) => d[1].join("")},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": (d) => d[1].join("")},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": (d) => JSON.parse("\""+d.join("")+"\"")},
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": (d) => JSON.parse("\""+d.join("")+"\"")},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": (d) => d.join('')},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": (d) => "'"},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": (d) => d.join("")},
    {"name": "uuids", "symbols": ["ie_uuid"], "postprocess": (d) => [d[0]]},
    {"name": "uuids", "symbols": ["uuids", "_", {"literal":","}, "_", "ie_uuid"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "ie_uuid", "symbols": ["UUID"], "postprocess": (d) => ({incl: true,  uuid: d[0]})},
    {"name": "ie_uuid", "symbols": ["NEGATE", "_", "UUID"], "postprocess": (d) => ({incl: false, uuid: d[2]})},
    {"name": "UUID", "symbols": ["H", "H", "H", "H", "H", "H", "H", "H", {"literal":"-"}, "H", "H", "H", "H", {"literal":"-"}, "H", "H", "H", "H", {"literal":"-"}, "H", "H", "H", "H", {"literal":"-"}, "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], "postprocess": (d) => d.join("")},
    {"name": "UUID", "symbols": ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], "postprocess": (d) => d.join("")},
    {"name": "UUID", "symbols": ["H", "H", "H"], "postprocess": (d) => d.join("")},
    {"name": "H", "symbols": [/[A-Fa-f0-9]/]}
  ],
  ParserStart: "main",
};

export default grammar;
