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
    {"name": "query", "symbols": ["TITLE", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({ filter: 'field', field: 'title',       value:  d[3]             })},
    {"name": "query", "symbols": ["ABSTRACT", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({ filter: 'field', field: 'abstract',    value:  d[3]             })},
    {"name": "query", "symbols": ["PYEAR", {"literal":":"}, "_", "COMP", "_", "year"], "postprocess": (d) => ({ filter: 'field', field: 'pub_year',    value:  d[5], comp: d[3] })},
    {"name": "query", "symbols": ["PDATE", {"literal":":"}, "_", "COMP", "_", "date"], "postprocess": (d) => ({ filter: 'field', field: 'date',        value:  d[5], comp: d[3] })},
    {"name": "query$subexpression$1", "symbols": [/[dD]/, /[oO]/, /[iI]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query", "symbols": ["query$subexpression$1", {"literal":":"}, "_", "dois"], "postprocess": (d) => ({ filter: 'field', field: 'doi',         values: d[3]             })},
    {"name": "query$subexpression$2", "symbols": [/[oO]/, /[aA]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query", "symbols": ["query$subexpression$2", {"literal":":"}, "_", "oa_ids"], "postprocess": (d) => ({ filter: 'field', field: 'openalex_id', values: d[3]             })},
    {"name": "query$subexpression$3", "symbols": [/[iI]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "query", "symbols": ["query$subexpression$3", {"literal":":"}, "_", "uuids"], "postprocess": (d) => ({ filter: 'field', field: 'item_id',     values: d[3]             })},
    {"name": "query", "symbols": ["SRC", {"literal":":"}, "_", "dqstring"], "postprocess": (d) => ({ filter: 'field', field: 'source',      value:  d[3]             })},
    {"name": "query", "symbols": ["META", {"literal":":"}, "_", "meta_clause"], "postprocess": (d) => ({ filter: 'meta',    ...d[3]                     })},
    {"name": "query", "symbols": ["LABEL", {"literal":":"}, "_", "label_clause"], "postprocess": (d) => ({ filter: 'label',   ...d[3]                     })},
    {"name": "query", "symbols": ["IMPORT", {"literal":":"}, "_", "ie_uuids"], "postprocess": (d) => ({ filter: 'import',  import_ids: d[3]            })},
    {"name": "query", "symbols": ["assigned_clause"], "postprocess": id},
    {"name": "query", "symbols": ["annotation_clause"], "postprocess": id},
    {"name": "query", "symbols": ["query", "__", "AND", "__", "query"], "postprocess": (d) => ({ filter: 'sub', 'and_': [d[0], d[4]]            })},
    {"name": "query", "symbols": ["query", "__", "OR", "__", "query"], "postprocess": (d) => ({ filter: 'sub', 'or_':  [d[0], d[4]]            })},
    {"name": "query", "symbols": [{"literal":"("}, "_", "query", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "assigned_clause$subexpression$1", "symbols": [/[iI]/, /[sS]/, {"literal":" "}, /[aA]/, /[sS]/, /[sS]/, /[iI]/, /[gG]/, /[nN]/, /[eE]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "assigned_clause", "symbols": ["assigned_clause$subexpression$1"], "postprocess": (d) => ({ filter: "assignment", mode: 1,              })},
    {"name": "assigned_clause$subexpression$2", "symbols": [/[iI]/, /[sS]/, {"literal":" "}, /[aA]/, /[sS]/, /[sS]/, /[iI]/, /[gG]/, /[nN]/, /[eE]/, /[dD]/, {"literal":" "}, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "assigned_clause", "symbols": ["assigned_clause$subexpression$2", "__", "uuids"], "postprocess": (d) => ({ filter: "assignment", mode: 2, scopes: d[2] })},
    {"name": "assigned_clause$subexpression$3", "symbols": [/[iI]/, /[sS]/, {"literal":" "}, /[aA]/, /[sS]/, /[sS]/, /[iI]/, /[gG]/, /[nN]/, /[eE]/, /[dD]/, {"literal":" "}, /[bB]/, /[uU]/, /[tT]/, {"literal":" "}, /[nN]/, /[oO]/, /[tT]/, {"literal":" "}, /[iI]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "assigned_clause", "symbols": ["assigned_clause$subexpression$3", "__", "uuids"], "postprocess": (d) => ({ filter: "assignment", mode: 3, scopes: d[2] })},
    {"name": "assigned_clause$subexpression$4", "symbols": [/[iI]/, /[sS]/, {"literal":" "}, /[nN]/, /[oO]/, /[tT]/, {"literal":" "}, /[aA]/, /[sS]/, /[sS]/, /[iI]/, /[gG]/, /[nN]/, /[eE]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "assigned_clause", "symbols": ["assigned_clause$subexpression$4"], "postprocess": (d) => ({ filter: "assignment", mode: 4               })},
    {"name": "assigned_clause$subexpression$5", "symbols": [/[iI]/, /[sS]/, {"literal":" "}, /[nN]/, /[oO]/, /[tT]/, {"literal":" "}, /[aA]/, /[sS]/, /[sS]/, /[iI]/, /[gG]/, /[nN]/, /[eE]/, /[dD]/, {"literal":" "}, /[iI]/, /[gG]/, /[nN]/, /[oO]/, /[rR]/, /[iI]/, /[nN]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "assigned_clause", "symbols": ["assigned_clause$subexpression$5", "__", "uuids"], "postprocess": (d) => ({ filter: "assignment", mode: 5, scopes: d[2] })},
    {"name": "annotation_clause$subexpression$1", "symbols": [/[hH]/, /[aA]/, /[sS]/, {"literal":" "}, /[aA]/, /[nN]/, /[nN]/, /[oO]/, /[tT]/, /[aA]/, /[tT]/, /[iI]/, /[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "annotation_clause$subexpression$2$string$1", "symbols": [{"literal":"I"}, {"literal":"N"}], "postprocess": (d) => d.join('')},
    {"name": "annotation_clause$subexpression$2", "symbols": ["__", "annotation_clause$subexpression$2$string$1", "__", "uuids"]},
    {"name": "annotation_clause$subexpression$2", "symbols": []},
    {"name": "annotation_clause", "symbols": ["annotation_clause$subexpression$1", "annotation_clause$subexpression$2"], "postprocess": (d) => ({ filter: "annotation", incl: true,  scopes: (d[1]||[])[3] })},
    {"name": "annotation_clause$subexpression$3", "symbols": [/[hH]/, /[aA]/, /[sS]/, {"literal":" "}, /[nN]/, /[oO]/, {"literal":" "}, /[aA]/, /[nN]/, /[nN]/, /[oO]/, /[tT]/, /[aA]/, /[tT]/, /[iI]/, /[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "annotation_clause$subexpression$4$string$1", "symbols": [{"literal":"I"}, {"literal":"N"}], "postprocess": (d) => d.join('')},
    {"name": "annotation_clause$subexpression$4", "symbols": ["__", "annotation_clause$subexpression$4$string$1", "__", "uuids"]},
    {"name": "annotation_clause$subexpression$4", "symbols": []},
    {"name": "annotation_clause", "symbols": ["annotation_clause$subexpression$3", "annotation_clause$subexpression$4"], "postprocess": (d) => ({ filter: "annotation", incl: false, scopes: (d[1]||[])[3] })},
    {"name": "meta_clause", "symbols": ["KEY", "_", "COMP", "_", "bool"], "postprocess": (d) => ({ field: d[0], comp: d[2],   value: d[4] })},
    {"name": "meta_clause", "symbols": ["KEY", "_", "COMP", "_", "uint"], "postprocess": (d) => ({ field: d[0], comp: d[2],   value: d[4] })},
    {"name": "meta_clause$string$1", "symbols": [{"literal":"L"}, {"literal":"I"}, {"literal":"K"}, {"literal":"E"}], "postprocess": (d) => d.join('')},
    {"name": "meta_clause", "symbols": ["KEY", "__", "meta_clause$string$1", "__", "dqstring"], "postprocess": (d) => ({ field: d[0], comp: "LIKE", value: d[4] })},
    {"name": "label_clause$subexpression$1$subexpression$1", "symbols": [/[fF]/, /[rR]/, /[oO]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_clause$subexpression$1", "symbols": ["__", "label_clause$subexpression$1$subexpression$1", "__", "uuids"]},
    {"name": "label_clause$subexpression$1", "symbols": []},
    {"name": "label_clause$subexpression$2$subexpression$1", "symbols": [/[rR]/, /[eE]/, /[pP]/, /[eE]/, /[aA]/, /[tT]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_clause$subexpression$2", "symbols": ["__", "label_clause$subexpression$2$subexpression$1", "__", "uints"]},
    {"name": "label_clause$subexpression$2", "symbols": []},
    {"name": "label_clause", "symbols": ["label_type", "label_clause_val", "label_clause$subexpression$1", "label_clause_users", "label_clause$subexpression$2"], "postprocess": 
        (d) => ({
            ...d[0],
            ...d[1],
            scopes:   (d[2]||[])[3],
            users:    d[3],
            repeats:  (d[4]||[])[3],
        })
            },
    {"name": "label_clause_users", "symbols": [], "postprocess": (d) => null},
    {"name": "label_clause_users$subexpression$1", "symbols": [/[bB]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_clause_users", "symbols": ["__", "label_clause_users$subexpression$1", "__", "uuids"], "postprocess": (d) => ({ user_ids: d[3], mode: 'ANY' })},
    {"name": "label_clause_users$subexpression$2", "symbols": [/[bB]/, /[yY]/, {"literal":" "}, /[aA]/, /[nN]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_clause_users", "symbols": ["__", "label_clause_users$subexpression$2", "__", "uuids"], "postprocess": (d) => ({ user_ids: d[3], mode: 'ANY' })},
    {"name": "label_clause_users$subexpression$3", "symbols": [/[bB]/, /[yY]/, {"literal":" "}, /[aA]/, /[lL]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_clause_users", "symbols": ["__", "label_clause_users$subexpression$3", "__", "uuids"], "postprocess": (d) => ({ user_ids: d[3], mode: 'ALL' })},
    {"name": "label_type", "symbols": [], "postprocess": (d) => ({ type: 'user'     })},
    {"name": "label_type$subexpression$1", "symbols": [/[uU]/, /[sS]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_type", "symbols": ["label_type$subexpression$1", "__"], "postprocess": (d) => ({ type: 'user'     })},
    {"name": "label_type$subexpression$2", "symbols": [/[bB]/, /[oO]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_type", "symbols": ["label_type$subexpression$2", "__"], "postprocess": (d) => ({ type: 'bot'      })},
    {"name": "label_type$subexpression$3", "symbols": [/[rR]/, /[eE]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_type", "symbols": ["label_type$subexpression$3", "__"], "postprocess": (d) => ({ type: 'resolved' })},
    {"name": "label_type$subexpression$4", "symbols": [/[rR]/, /[eE]/, /[sS]/, /[oO]/, /[lL]/, /[vV]/, /[eE]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_type", "symbols": ["label_type$subexpression$4", "__"], "postprocess": (d) => ({ type: 'resolved' })},
    {"name": "label_type$subexpression$5", "symbols": [/[rR]/, /[eE]/, /[sS]/, /[oO]/, /[lL]/, /[uU]/, /[tT]/, /[iI]/, /[oO]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "label_type", "symbols": ["label_type$subexpression$5", "__"], "postprocess": (d) => ({ type: 'resolved' })},
    {"name": "label_clause_val", "symbols": ["KEY", "_", "COMP", "_", "uint"], "postprocess": (d) => ({ value_type: 'int',   key: d[0], value_int:  d[4], comp: d[2] })},
    {"name": "label_clause_val", "symbols": ["KEY", "_", {"literal":"="}, "_", "bool"], "postprocess": (d) => ({ value_type: 'bool',  key: d[0], value_bool: d[4]             })},
    {"name": "label_clause_val", "symbols": ["KEY", "_", "COMP_SET", "_", "uints"], "postprocess": (d) => ({ value_type: 'multi', key: d[0], multi_int:  d[4], comp: d[2] })},
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
    {"name": "ABSTRACT$subexpression$3", "symbols": [/[tT]/, /[eE]/, /[xX]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ABSTRACT", "symbols": ["ABSTRACT$subexpression$3"]},
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
    {"name": "SRC$subexpression$1", "symbols": [/[sS]/, /[oO]/, /[uU]/, /[rR]/, /[cC]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "SRC", "symbols": ["SRC$subexpression$1"]},
    {"name": "SRC$subexpression$2", "symbols": [/[sS]/, /[rR]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "SRC", "symbols": ["SRC$subexpression$2"]},
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
    {"name": "COMP_EXT$string$2", "symbols": [{"literal":"S"}, {"literal":"I"}, {"literal":"M"}, {"literal":"I"}, {"literal":"L"}, {"literal":"A"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "COMP_EXT", "symbols": ["COMP_EXT$string$2"], "postprocess": id},
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
    {"name": "uints", "symbols": ["_uints"], "postprocess": (d) => d[0]},
    {"name": "uints", "symbols": [{"literal":"["}, "_uints", {"literal":"]"}], "postprocess": (d) => d[1]},
    {"name": "uints", "symbols": [{"literal":"{"}, "_uints", {"literal":"}"}], "postprocess": (d) => d[1]},
    {"name": "_uints", "symbols": ["uint"], "postprocess": (d) => [d[0]]},
    {"name": "_uints", "symbols": ["_uints", "_", {"literal":","}, "_", "uint"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "uint$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "uint$ebnf$1", "symbols": ["uint$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "uint", "symbols": ["uint$ebnf$1"], "postprocess": (d) => parseInt(d[0].join(""))},
    {"name": "float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "float$ebnf$1", "symbols": ["float$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "float$ebnf$2", "symbols": []},
    {"name": "float$ebnf$2", "symbols": ["float$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "float", "symbols": ["float$ebnf$1", {"literal":"."}, "float$ebnf$2"], "postprocess": (d) => parseFloat(d[0].join("") + "." + d[2].join(""))},
    {"name": "bool$subexpression$1", "symbols": [/[tT]/, /[rR]/, /[uU]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "bool", "symbols": ["bool$subexpression$1"], "postprocess": (d) => true},
    {"name": "bool$subexpression$2", "symbols": [/[fF]/, /[aA]/, /[lL]/, /[sS]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "bool", "symbols": ["bool$subexpression$2"], "postprocess": (d) => false},
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
    {"name": "dois", "symbols": ["_dois"], "postprocess": (d) => d[0]},
    {"name": "dois", "symbols": [{"literal":"["}, "_dois", {"literal":"]"}], "postprocess": (d) => d[1]},
    {"name": "dois", "symbols": [{"literal":"{"}, "_dois", {"literal":"}"}], "postprocess": (d) => d[1]},
    {"name": "_dois", "symbols": ["DOI"], "postprocess": (d) => [d[0]]},
    {"name": "_dois", "symbols": ["_dois", "_", {"literal":","}, "_", "DOI"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "DOI$ebnf$1", "symbols": [/[A-Za-z0-9_./:-]/]},
    {"name": "DOI$ebnf$1", "symbols": ["DOI$ebnf$1", /[A-Za-z0-9_./:-]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "DOI", "symbols": ["DOI$ebnf$1"], "postprocess": (d) => d[0].join("")},
    {"name": "oa_ids", "symbols": ["_oa_ids"], "postprocess": (d) => d[0]},
    {"name": "oa_ids", "symbols": [{"literal":"["}, "_oa_ids", {"literal":"]"}], "postprocess": (d) => d[1]},
    {"name": "oa_ids", "symbols": [{"literal":"{"}, "_oa_ids", {"literal":"}"}], "postprocess": (d) => d[1]},
    {"name": "_oa_ids", "symbols": ["OA_ID"], "postprocess": (d) => [d[0]]},
    {"name": "_oa_ids", "symbols": ["_oa_ids", "_", {"literal":","}, "_", "OA_ID"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "OA_ID$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "OA_ID$ebnf$1", "symbols": ["OA_ID$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "OA_ID", "symbols": [{"literal":"W"}, "OA_ID$ebnf$1"], "postprocess": (d) => "W" + d[1].join("")},
    {"name": "uuids", "symbols": ["_uuids"], "postprocess": (d) => d[0]},
    {"name": "uuids", "symbols": [{"literal":"["}, "_uuids", {"literal":"]"}], "postprocess": (d) => d[1]},
    {"name": "uuids", "symbols": [{"literal":"{"}, "_uuids", {"literal":"}"}], "postprocess": (d) => d[1]},
    {"name": "_uuids", "symbols": ["UUID"], "postprocess": (d) => [d[0]]},
    {"name": "_uuids", "symbols": ["_uuids", "_", {"literal":","}, "_", "UUID"], "postprocess": (d) => d[0].concat([d[4]])},
    {"name": "ie_uuids", "symbols": ["_ie_uuids"], "postprocess": (d) => d[0]},
    {"name": "ie_uuids", "symbols": [{"literal":"["}, "_ie_uuids", {"literal":"]"}], "postprocess": (d) => d[1]},
    {"name": "ie_uuids", "symbols": [{"literal":"{"}, "_ie_uuids", {"literal":"}"}], "postprocess": (d) => d[1]},
    {"name": "_ie_uuids", "symbols": ["ie_uuid"], "postprocess": (d) => [d[0]]},
    {"name": "_ie_uuids", "symbols": ["_ie_uuids", "_", {"literal":","}, "_", "ie_uuid"], "postprocess": (d) => d[0].concat([d[4]])},
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
