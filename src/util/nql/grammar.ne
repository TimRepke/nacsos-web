@preprocessor typescript

main -> _ query _ {% (d) => d[1] %}

query ->
    TITLE    ":" _ dqstring           {% (d) => ({ filter: 'field', field: 'title',       value:  d[3]             }) %}
  | ABSTRACT ":" _ dqstring           {% (d) => ({ filter: 'field', field: 'abstract',    value:  d[3]             }) %}
  | PYEAR    ":" _ COMP _ year        {% (d) => ({ filter: 'field', field: 'pub_year',    value:  d[5], comp: d[3] }) %}
  | PDATE    ":" _ COMP _ date        {% (d) => ({ filter: 'field', field: 'date',        value:  d[5], comp: d[3] }) %}
  | "DOI"i   ":" _ dois               {% (d) => ({ filter: 'field', field: 'doi',         values: d[3]             }) %}
  | "OA"i    ":" _ oa_ids             {% (d) => ({ filter: 'field', field: 'openalex_id', values: d[3]             }) %}
  | "ID"i    ":" _ uuids              {% (d) => ({ filter: 'field', field: 'item_id',     values: d[3]             }) %}
  | SRC      ":" _ dqstring           {% (d) => ({ filter: 'field', field: 'source',      value:  d[3]             }) %}
  | META     ":" _ meta_clause        {% (d) => ({ filter: 'meta',    ...d[3]                     }) %}
  | LABEL    ":" _ label_clause       {% (d) => ({ filter: 'label',   ...d[3]                     }) %}
  | IMPORT   ":" _ ie_uuids           {% (d) => ({ filter: 'import',  import_ids: d[3]            }) %}
  | assigned_clause                   {% id %}
  | annotation_clause                 {% id %}
  | query __ AND __ query             {% (d) => ({ filter: 'sub', 'and_': [d[0], d[4]]            }) %}
  | query __ OR  __ query             {% (d) => ({ filter: 'sub', 'or_':  [d[0], d[4]]            }) %}
  | "(" _ query _ ")"                 {% (d) => d[2]                                                 %}

assigned_clause ->
    "IS ASSIGNED"i                        {% (d) => ({ filter: "assignment", mode: 1,              }) %}
  | "IS ASSIGNED IN"i           __ uuids  {% (d) => ({ filter: "assignment", mode: 2, scopes: d[2] }) %}
  | "IS ASSIGNED BUT NOT IN"i   __ uuids  {% (d) => ({ filter: "assignment", mode: 3, scopes: d[2] }) %}
  | "IS NOT ASSIGNED"i                    {% (d) => ({ filter: "assignment", mode: 4               }) %}
  | "IS NOT ASSIGNED IGNORING"i __ uuids  {% (d) => ({ filter: "assignment", mode: 5, scopes: d[2] }) %}

annotation_clause ->
    "HAS ANNOTATION"i     (__ "IN" __ uuids | null)  {% (d) => ({ filter: "annotation", incl: true,  scopes: (d[1]||[])[3] }) %}
  | "HAS NO ANNOTATION"i  (__ "IN" __ uuids | null)  {% (d) => ({ filter: "annotation", incl: false, scopes: (d[1]||[])[3] }) %}

meta_clause ->
    KEY _  COMP    _  bool      {% (d) => ({ field: d[0], comp: d[2],   value: d[4] }) %}
  | KEY _  COMP    _  uint      {% (d) => ({ field: d[0], comp: d[2],   value: d[4] }) %}
  | KEY __ "LIKE"  __ dqstring  {% (d) => ({ field: d[0], comp: "LIKE", value: d[4] }) %}

label_clause -> label_type label_clause_val (__ "FROM"i __ uuids | null) label_clause_users (__ "REPEATS"i __ uints | null) {%
        (d) => ({
            ...d[0],
            ...d[1],
            scopes:   (d[2]||[])[3],
            users:    d[3],
            repeats:  (d[4]||[])[3],
        })
    %}

label_clause_users ->
    null                   {% (d) => null                             %}
  | __ "BY"i     __ uuids  {% (d) => ({ user_ids: d[3], mode: 'ANY' }) %}
  | __ "BY ANY"i __ uuids  {% (d) => ({ user_ids: d[3], mode: 'ANY' }) %}
  | __ "BY ALL"i __ uuids  {% (d) => ({ user_ids: d[3], mode: 'ALL' }) %}

label_type ->
    null              {% (d) => ({ type: 'user'     }) %}
  | "USER"i       __  {% (d) => ({ type: 'user'     }) %}
  | "BOT"i        __  {% (d) => ({ type: 'bot'      }) %}
  | "RES"i        __  {% (d) => ({ type: 'resolved' }) %}
  | "RESOLVED"i   __  {% (d) => ({ type: 'resolved' }) %}
  | "RESOLUTION"i __  {% (d) => ({ type: 'resolved' }) %}

label_clause_val ->
    KEY _ COMP     _ uint   {% (d) => ({ filter: 'label_int',   value_type: 'int',   key: d[0], value_int:  d[4], comp: d[2] }) %}
  | KEY _ "="      _ bool   {% (d) => ({ filter: 'label_bool',  value_type: 'bool',  key: d[0], value_bool: d[4]             }) %}
  | KEY _ COMP_SET _ uints  {% (d) => ({ filter: 'label_multi', value_type: 'multi', key: d[0], multi_int:  d[4], comp: d[2] }) %}

KEY   -> [A-Za-z_-]:+        {% (d) => d[0].join("") %}

TITLE    -> "ti"i  | "title"i
ABSTRACT -> "abs"i | "abstract"i | "text"i
PYEAR    -> "py"i  | "year"i | "yr"i
PDATE    -> "pd"i  | "date"i
IMPORT   -> "import"i
LABEL    -> "label"i
META     -> "meta"i
SRC      -> "source"i | "src"i

AND -> "and"i | "&"
OR  -> "or"i  | "|"

COMP ->
    "="   {% id %}
  | "<"   {% id %}
  | "<="  {% id %}
  | ">"   {% id %}
  | ">="  {% id %}
  | "!="  {% id %}

COMP_EXT ->
    "LIKE"     {% id %}
  | "SIMILAR"  {% id %}
  | COMP       {% id %}

COMP_SET ->
    "=="  {% id %}
  | "@>"  {% id %}  # Does the first array contain the second? Example: [1,4,3] @> [3,1,3] → t
  | "!>"  {% id %}  # Does the first array contain none of the second? Example: [1,4,3] !> [2,5,6] → t
 #| "<@"  {% id %}  # Is the first array contained by the second? Example: [2,2,7] <@ [1,7,4,2,6] → t
  | "&&"  {% id %}  # Do the arrays overlap; any elements in common? Example: [1,4,3] && [2,1] → t

NEGATE ->
    "not"i __
  | "~"
  | "-"

# Whitespaces
_  -> [\s]:* {% (d) => null %}
__ -> [\s]:+ {% (d) => null %}

date  -> year "-" [0-9] [0-9] "-" [0-9] [0-9]  {% (d) => d.join("") %}
year  -> [0-9] [0-9] [0-9] [0-9]               {% (d) => parseInt(d.join("")) %}

uints ->
    _uints                       {% (d) => d[0] %}
  | "[" _uints "]"               {% (d) => d[1] %}  # optional brackets
  | "{" _uints "}"               {% (d) => d[1] %}  # optional brackets
_uints ->
    uint                         {% (d) => [d[0]] %}
  | _uints _ "," _ uint          {% (d) => d[0].concat([d[4]]) %}
uint  -> [0-9]:+                 {% (d) => parseInt(d[0].join("")) %}
float -> [0-9]:+ "." [0-9]:*     {% (d) => parseFloat(d[0].join("") + "." + d[2].join("")) %}
bool  ->
    "true"i                      {% (d) => true  %}
  | "false"i                     {% (d) => false %}

dqstring -> "\"" dstrchar:* "\"" {% (d) => d[1].join("") %}
sqstring -> "'"  sstrchar:* "'"  {% (d) => d[1].join("") %}
btstring -> "`"  [^`]:*     "`"  {% (d) => d[1].join("") %}

dstrchar ->
    [^\\"\n]        {% id %}
  | "\\" strescape  {% (d) => JSON.parse("\""+d.join("")+"\"") %}

sstrchar ->
    [^\\'\n]        {% id %}
  | "\\" strescape  {% (d) => JSON.parse("\""+d.join("")+"\"") %}
  | "\\'"           {% (d) => "'" %}

strescape ->
    ["\\/bfnrt]     {% id %}
  | "u" [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] [a-fA-F0-9] {% (d) => d.join("") %}

dois ->
    _dois                      {% (d) => d[0] %}
  | "[" _dois "]"              {% (d) => d[1] %}  # optional brackets
  | "{" _dois "}"              {% (d) => d[1] %}  # optional brackets
_dois ->
    DOI                        {% (d) => [d[0]]              %}
  | _dois _ "," _ DOI          {% (d) => d[0].concat([d[4]]) %}
DOI   -> [A-Za-z0-9_./:-]:+    {% (d) => d[0].join("") %}

oa_ids ->
    _oa_ids                    {% (d) => d[0] %}
  | "[" _oa_ids "]"            {% (d) => d[1] %}  # optional brackets
  | "{" _oa_ids "}"            {% (d) => d[1] %}  # optional brackets
_oa_ids ->
    OA_ID                      {% (d) => [d[0]]              %}
  | _oa_ids _ "," _ OA_ID      {% (d) => d[0].concat([d[4]]) %}
OA_ID -> "W" [0-9]:+           {% (d) => "W" + d[1].join("") %}

uuids ->
    _uuids                     {% (d) => d[0] %}
  | "[" _uuids "]"             {% (d) => d[1] %}  # optional brackets
  | "{" _uuids "}"             {% (d) => d[1] %}  # optional brackets
_uuids ->
    UUID                       {% (d) => [d[0]]              %}
  | _uuids _ "," _ UUID        {% (d) => d[0].concat([d[4]]) %}
ie_uuids ->
    _ie_uuids                  {% (d) => d[0] %}
  | "[" _ie_uuids "]"          {% (d) => d[1] %}  # optional brackets
  | "{" _ie_uuids "}"          {% (d) => d[1] %}  # optional brackets
_ie_uuids ->
    ie_uuid                    {% (d) => [d[0]]              %}
  | _ie_uuids _ "," _ ie_uuid  {% (d) => d[0].concat([d[4]]) %}
ie_uuid -> 
    UUID                       {% (d) => ({incl: true,  uuid: d[0]}) %}
  | NEGATE _ UUID              {% (d) => ({incl: false, uuid: d[2]}) %}

# /[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}/
# /[A-Fa-f0-9]{32}/
UUID ->
    H H H H H H H H "-" H H H H "-" H H H H "-" H H H H "-" H H H H H H H H H H H H  {% (d) => d.join("") %}
  | H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H H                  {% (d) => d.join("") %}
  | H H H                                                                            {% (d) => d.join("") %}
H -> [A-Fa-f0-9]
