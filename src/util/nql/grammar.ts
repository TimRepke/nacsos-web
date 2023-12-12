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
    {"name": "query", "symbols": ["TITLE", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({ field: 'title',    value: d[3]             })},
    {"name": "query", "symbols": ["ABSTRACT", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({ field: 'abstract', value: d[3]             })},
    {"name": "query", "symbols": ["PYEAR", {"literal":":"}, "_", "COMP", "_", "year"], "postprocess": (d) => ({ field: 'pub_year', value: d[5], comp: d[3] })},
    {"name": "query", "symbols": ["PDATE", {"literal":":"}, "_", "COMP", "_", "date"], "postprocess": (d) => ({ field: 'date',     value: d[5], comp: d[3] })},
    {"name": "query", "symbols": ["META", {"literal":":"}, "_", "meta_clause"], "postprocess": (d) => ({ filter: 'meta',    ...d[3]                 })},
    {"name": "query", "symbols": ["LABEL", {"literal":":"}, "_", "label_clause"], "postprocess": (d) => ({ filter: 'label',   ...d[3]                 })},
    {"name": "query", "symbols": ["IMPORT", {"literal":":"}, "_", "ie_uuids"], "postprocess": (d) => ({ filter: 'import',  import_ids: d[3]        })},
    {"name": "query", "symbols": ["query", "__", "AND", "__", "query"], "postprocess": (d) => ({ 'and': [d[0], d[4]]                        })},
    {"name": "query", "symbols": ["query", "__", "OR", "__", "query"], "postprocess": (d) => ({ 'or':  [d[0], d[4]]                        })},
    {"name": "query", "symbols": [{"literal":"("}, "_", "query", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "meta_clause", "symbols": ["KEY", "_", "COMP", "_", "bool"], "postprocess": (d) => ({ field: d[0], comp: d[2],   value: d[4] })},
    {"name": "meta_clause", "symbols": ["KEY", "_", "COMP", "_", "uint"], "postprocess": (d) => ({ field: d[0], comp: d[2],   value: d[4] })},
    {"name": "meta_clause$string$1", "symbols": [{"literal":"L"}, {"literal":"I"}, {"literal":"K"}, {"literal":"E"}], "postprocess": (d) => d.join('')},
    {"name": "meta_clause", "symbols": ["KEY", "__", "meta_clause$string$1", "__", "dqstring"], "postprocess": (d) => ({ field: d[0], comp: "LIKE", value: d[4] })},
    {"name": "label_clause$subexpression$1$string$1", "symbols": [{"literal":"F"}, {"literal":"R"}, {"literal":"O"}, {"literal":"M"}], "postprocess": (d) => d.join('')},
    {"name": "label_clause$subexpression$1", "symbols": ["__", "label_clause$subexpression$1$string$1", "__", "ie_uuids"]},
    {"name": "label_clause$subexpression$1", "symbols": []},
    {"name": "label_clause$subexpression$2$string$1", "symbols": [{"literal":"B"}, {"literal":"Y"}], "postprocess": (d) => d.join('')},
    {"name": "label_clause$subexpression$2", "symbols": ["__", "label_clause$subexpression$2$string$1", "__", "ie_uuids"]},
    {"name": "label_clause$subexpression$2", "symbols": []},
    {"name": "label_clause", "symbols": ["label_clause_val", "label_clause$subexpression$1", "label_clause$subexpression$2"], "postprocess": 
        (d) => ({
            ...d[0],
            scopes: (d[1]||[])[3],
            users:  (d[2]||[])[3],
        })
            },
    {"name": "label_clause_val", "symbols": ["KEY", "_", "COMP", "_", "uint"], "postprocess": (d) => ({ key: d[0], value_int:  d[4], comp: d[2] })},
    {"name": "label_clause_val", "symbols": ["KEY", "_", {"literal":"="}, "_", "bool"], "postprocess": (d) => ({ key: d[0], value_bool: d[4]             })},
    {"name": "label_clause_val", "symbols": ["KEY", "_", "COMP_SET", "_", "uints"], "postprocess": (d) => ({ key: d[0], multi_int:  d[4], comp: d[2] })},
    {"name": "KEY$ebnf$1", "symbols": [/[A-Za-z_-]/]},
    {"name": "KEY$ebnf$1", "symbols": ["KEY$ebnf$1", /[A-Za-z_-]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "KEY", "symbols": ["KEY$ebnf$1"], "postprocess": (d) => d[0].join("")},
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
    {"name": "PDATE$subexpression$1", "symbols": [/[pP]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PDATE", "symbols": ["PDATE$subexpression$1"]},
    {"name": "PDATE$subexpression$2", "symbols": [/[dD]/, /[aA]/, /[tT]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "PDATE", "symbols": ["PDATE$subexpression$2"]},
    {"name": "IMPORT$subexpression$1", "symbols": [/[iI]/, /[mM]/, /[pP]/, /[oO]/, /[rR]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "IMPORT", "symbols": ["IMPORT$subexpression$1"]},
    {"name": "LABEL$subexpression$1", "symbols": [/[lL]/, /[aA]/, /[bB]/, /[eE]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "LABEL", "symbols": ["LABEL$subexpression$1"]},
    {"name": "META$subexpression$1", "symbols": [/[mM]/, /[eE]/, /[tT]/, /[aA]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "META", "symbols": ["META$subexpression$1"]},
    {"name": "AND$subexpression$1", "symbols": [/[aA]/, /[nN]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "AND", "symbols": ["AND$subexpression$1"]},
    {"name": "AND", "symbols": [{"literal":"&"}]},
    {"name": "OR$subexpression$1", "symbols": [/[oO]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "OR", "symbols": ["OR$subexpression$1"]},
    {"name": "OR", "symbols": [{"literal":"|"}]},
    {"name": "COMP", "symbols": [{"literal":"="}], "postprocess": id},
    {"name": "COMP", "symbols": [{"literal":"<"}], "postprocess": id},
    {"name": "COMP$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMP", "symbols": ["COMP$string$1"], "postprocess": id},
    {"name": "COMP", "symbols": [{"literal":">"}], "postprocess": id},
    {"name": "COMP$string$2", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMP", "symbols": ["COMP$string$2"], "postprocess": id},
    {"name": "COMP$string$3", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMP", "symbols": ["COMP$string$3"], "postprocess": id},
    {"name": "COMP_EXT$string$1", "symbols": [{"literal":"L"}, {"literal":"I"}, {"literal":"K"}, {"literal":"E"}], "postprocess": (d) => d.join('')},
    {"name": "COMP_EXT", "symbols": ["COMP_EXT$string$1"], "postprocess": id},
    {"name": "COMP_EXT", "symbols": ["COMP"], "postprocess": id},
    {"name": "COMP_SET$string$1", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "COMP_SET", "symbols": ["COMP_SET$string$1"], "postprocess": id},
    {"name": "COMP_SET$string$2", "symbols": [{"literal":"@"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "COMP_SET", "symbols": ["COMP_SET$string$2"], "postprocess": id},
    {"name": "COMP_SET$string$3", "symbols": [{"literal":"!"}, {"literal":">"}], "postprocess": (d) => d.join('')},
    {"name": "COMP_SET", "symbols": ["COMP_SET$string$3"], "postprocess": id},
    {"name": "COMP_SET$string$4", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": (d) => d.join('')},
    {"name": "COMP_SET", "symbols": ["COMP_SET$string$4"], "postprocess": id},
    {"name": "NEGATE$subexpression$1", "symbols": [/[nN]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "NEGATE", "symbols": ["NEGATE$subexpression$1", "__"]},
    {"name": "NEGATE", "symbols": [{"literal":"~"}]},
    {"name": "NEGATE", "symbols": [{"literal":"-"}]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": (d) => null},
    {"name": "date", "symbols": ["year", {"literal":"-"}, /[0-9]/, /[0-9]/, {"literal":"-"}, /[0-9]/, /[0-9]/], "postprocess": (d) => d.join("")},
    {"name": "year", "symbols": [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/], "postprocess": (d) => parseInt(d.join(""))},
    {"name": "uints", "symbols": ["uint"], "postprocess": (d) => [d[0]]},
    {"name": "uints", "symbols": ["uints", "_", {"literal":","}, "_", "uint"], "postprocess": (d) => d[0].concat([d[4]])},
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
    {"name": "uuids", "symbols": ["UUID"], "postprocess": (d) => [d[0]]},
    {"name": "uuids", "symbols": ["uuids", "_", {"literal":","}, "_", "UUID"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "ie_uuids", "symbols": ["ie_uuid"], "postprocess": (d) => [d[0]]},
    {"name": "ie_uuids", "symbols": ["ie_uuids", "_", {"literal":","}, "_", "ie_uuid"], "postprocess": (d) => d[0].concat([d[4]])},
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
